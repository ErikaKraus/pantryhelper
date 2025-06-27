import {ComponentProps, FunctionComponent} from 'react'
import {Button} from '@/components/ui/button'

type SubmitButtonProps = ComponentProps<typeof Button>

const SubmitButton: FunctionComponent<SubmitButtonProps> = ({children, ...props}) => {
  return <Button {...props}>{children}</Button>
}

export default SubmitButton
