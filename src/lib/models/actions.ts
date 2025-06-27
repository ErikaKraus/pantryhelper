export type ValidationErrors = Record<string, string[] | undefined>
export type ServerFunctionResponse = {
  errors?: ValidationErrors
  success: boolean
  submittedData?: Record<string, string>
}
