'use client'
import {FunctionComponent} from 'react'
import {Button} from '@/components/ui/button'
import {Loader2} from 'lucide-react'
import {useFormStatus} from 'react-dom'

interface SubmitButtonWithLoadingProps {
    text: string
    loadingText: string
}

const SubmitButtonWithLoading: FunctionComponent<SubmitButtonWithLoadingProps> = ({text, loadingText, ...props}) => {
    const {pending} = useFormStatus()

    return (
        <Button disabled={pending} type="submit" className="sm" {...props}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? loadingText : text}
        </Button>
    )
}

export default SubmitButtonWithLoading
