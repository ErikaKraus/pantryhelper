'use client'
import {FunctionComponent, useActionState} from 'react'
import {Card, CardContent} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import SubmitButton from '@/components/custom/form/submitButton'
import Link from 'next/link'
import {useZodValidatedForm} from '@/lib/hooks'
import {registerSchema, signInSchema} from '@/lib/schemas'
import Actions from '@/lib/server/actions'
import Form from '@/components/custom/form/form'
import FormError from '@/components/custom/form/formError'

interface AuthFormProps {
  type: 'login' | 'register'
}

const AuthForm: FunctionComponent<AuthFormProps> = ({type}) => {
  const loginLink = <Link href="/login">Heb je een account? Log je hier dan in.</Link>
  const registerLink = <Link href="/register">Nog geen account? Maak er hier een aan.</Link>
  const isLogin = type === 'login'
  const form = useZodValidatedForm(isLogin ? signInSchema : registerSchema)
  const [actionResult, signInOrRegister] = useActionState(isLogin ? Actions.signIn : Actions.register, {success: false})

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md p-6 shadow-md">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-4">{type === 'login' ? 'Inloggen' : 'Registreren'}</h2>
          <Form hookForm={form} action={signInOrRegister} method={'POST'} actionResult={actionResult}>
            <div className="mb-4">
              <Input
                placeholder="Email"
                {...form.register('email')}
                defaultValue={actionResult?.submittedData?.email ?? ''}
              />
              <FormError path="email" formErrors={form.formState.errors} serverErrors={actionResult} />
            </div>
            {type === 'register' && (
              <>
                <div className="mb-4">
                  <Input
                    placeholder="First name"
                    {...form.register('firstName')}
                    defaultValue={actionResult?.submittedData?.firstName ?? ''}
                  />
                  <FormError path="firstName" formErrors={form.formState.errors} serverErrors={actionResult} />
                </div>
                <div className="mb-4">
                  <Input
                    placeholder="Last name"
                    {...form.register('lastName')}
                    defaultValue={actionResult?.submittedData?.lastName ?? ''}
                  />
                  <FormError path="lastName" formErrors={form.formState.errors} serverErrors={actionResult} />
                </div>
              </>
            )}

            <div className="mb-4">
              <Input placeholder="Password" {...form.register('password')} type="password" />
              <FormError path="password" formErrors={form.formState.errors} serverErrors={actionResult} />
            </div>
            {type === 'register' && (
              <div className="mb-4">
                <Input placeholder="Confirm your password" {...form.register('passwordConfirmation')} type="password" />
                <FormError path="passwordConfirmation" formErrors={form.formState.errors} serverErrors={actionResult} />
              </div>
            )}
            <SubmitButton data-testid="login-button" className="w-full">
              {type === 'login' ? 'Inloggen' : 'Registreren'}
            </SubmitButton>
            <div className="text-muted-foreground mt-1">{type === 'login' ? registerLink : loginLink}</div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthForm
