import {Profile, ServerFunctionResponse} from '@models'
import {z, ZodSchema} from 'zod'
import {getSessionProfileAndOptionallyExtend} from '@mediators'
import {convertFormData} from '@serverUtils'

interface Error {
  message: string
}

type UnprotectedAction<T extends ZodSchema> = (validatedData: z.infer<T>) => Promise<ServerFunctionResponse | void>
type ProtectedAction<T extends ZodSchema> = (
  validatedData: z.infer<T>,
  profile: Profile,
) => Promise<ServerFunctionResponse | void>

type FormAction = (prevState: ServerFunctionResponse, formData: FormData) => Promise<ServerFunctionResponse>
type ValidationResult<T> = {data: null; errors: Record<string, string[] | undefined>} | {data: T; errors: null}
type ServerFunction<T extends ZodSchema> = (data: z.infer<T>) => Promise<void>

/**
 * A utility function used to abstract the common logic of form actions.
 *
 * @param schema The schema to validate the form data against.
 * @param fn The function to execute when the form data is valid. This function can have 1 or 2 arguments.
 *    - Argument 1: The validated form data. If this is the only argument, the function is unprotected and anyone can
 *      call it.
 *    - Argument 2: The profile of the currently authenticated user. If this argument is present, the function is
 *      protected and can only be called by authenticated users.
 * @param roles The roles that are allowed to call the form action. If the user is not logged in, the form action will
 *      fail. By default, all roles are allowed, including unauthenticated users. If a second argument is provided to
 *      the fn parameter, all roles are allowed, excepting anonymous users.
 */
export function formAction<T extends ZodSchema>(schema: T, fn: ProtectedAction<T>): FormAction {
  return async (_prevState: ServerFunctionResponse, unvalidatedData: FormData): Promise<ServerFunctionResponse> => {
    return handleServerFunction(schema, unvalidatedData, fn)
  }
}

export function serverFunction<T extends ZodSchema>(schema: T, fn: ProtectedAction<T>): ServerFunction<T> {
  return async (unvalidatedData: z.infer<T>): Promise<void> => {
    const result = await handleServerFunction(schema, unvalidatedData, fn)
    if (!result.success) {
      throw new Error('Error in a serverFunction', {cause: result.errors})
    }
  }
}

async function handleServerFunction<T extends ZodSchema>(
  schema: T,
  unvalidatedData: unknown,
  fn: ProtectedAction<T>,
): Promise<ServerFunctionResponse> {
  try {
    const requiresAuth = fn.length > 1
    const profile = requiresAuth ? await getSessionProfileAndOptionallyExtend() : undefined

    const {data, errors} = validateSchema(schema, unvalidatedData)
    if (errors) {
      return {
        errors,
        success: false,
        submittedData: (unvalidatedData instanceof FormData
          ? Object.fromEntries(unvalidatedData.entries())
          : unvalidatedData) as Record<string, string>,
      }
    }

    // Het is noodzakelijk om hier een await te gebruiken.
    // Als we fn rechtstreeks teruggeven worden eventuele opgegooide errors niet opgevangen, maar teruggegeven via de
    // catch methode van de promise.
    const result = await (profile ? fn(data, profile) : (fn as UnprotectedAction<T>)(data))
    return result ?? {success: true}
  } catch (e) {
    const error = e as Error

    // De redirect functie werkt door een error op te gooien, we mogen deze error dus niet onderscheppen, maar moeten
    // deze terug opgooien zodat Next de gebruiker kan redirecten.
    if (error.message === 'NEXT_REDIRECT') {
      throw e
    }

    console.error('Error in formAction:', error)

    return {
      errors: {
        errors: ['Something went wrong, please ensure you are logged in and try again'],
      },
      success: false,
      submittedData: (unvalidatedData instanceof FormData
        ? Object.fromEntries(unvalidatedData.entries())
        : unvalidatedData) as Record<string, string>,
    }
  }
}

/**
 * Validate the given data against the given ZodSchema.
 *
 * @param schema The schema to validate the data against.
 * @param data The data to validate, either FormData or a plain object.
 * @return An object which either contains the validated data or the validation errors.
 */
export function validateSchema<T extends ZodSchema>(schema: T, data: unknown): ValidationResult<z.infer<T>> {
  const result = schema.safeParse(data instanceof FormData ? convertFormData(data) : data)
  return result.success
    ? {data: result.data as z.infer<T>, errors: null}
    : {data: null, errors: result.error.flatten().fieldErrors}
}
