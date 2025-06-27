import {FunctionComponent} from 'react'
import AuthForm from '@/components/custom/form/authForm'

interface PageProps {}

const RegisterPage: FunctionComponent<PageProps> = () => {
  return <AuthForm type="register" />
}

export default RegisterPage
