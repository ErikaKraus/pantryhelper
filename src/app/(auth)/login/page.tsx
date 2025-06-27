import {FunctionComponent} from 'react'
import AuthForm from '@/components/custom/form/authForm'

interface PageProps {}

const LoginPage: FunctionComponent<PageProps> = () => {
  return <AuthForm type="login" />
}

export default LoginPage
