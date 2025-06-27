import {useForm, UseFormProps, UseFormReturn} from 'react-hook-form'
import {z, ZodSchema} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

export function useZodValidatedForm<S extends ZodSchema>(
  schema: S,
  props?: UseFormProps<z.infer<S>>,
): UseFormReturn<z.infer<S>> {
  return useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    ...props,
  })
}
