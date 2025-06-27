import {Button, ButtonProps} from '@/components/ui/button'
import {FunctionComponent, PropsWithChildren, ReactNode, useTransition} from 'react'
import {Loader2} from 'lucide-react'

interface ActionButtonProps extends ButtonProps, PropsWithChildren {
    action: () => Promise<void>
    pendingContent?: ReactNode
}

const ActionButton: FunctionComponent<ActionButtonProps> = ({action, children, pendingContent, ...buttonProps}) => {
    // De useTransition hook wordt gebruikt om een server function op te roepen (waarna deze een server action genoemd
    // wordt). De isPending variabele geeft aan of er een transition bezig is, en de startTransition functie wordt
    // gebruikt om een nieuwe transition te starten.
    // State updates die binnen een transition worden gedaan, worden pas doorgevoerd nadat alle transition afgehandeld
    // zijn, als een gebruiker snel 20 keer op een knop drukt, worden er dus 20 transitions uitgevoerd en wordt de state
    // pas aangepast als alle 20 transitions zijn afgehandeld.
    const [isPending, startTransition] = useTransition()

    return (
        <Button
            {...buttonProps}
            onClick={evt => {
                // Allow the button to be used in a form without submitting it.
                evt.preventDefault()
                startTransition(action)
            }}
            disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending && pendingContent ? pendingContent : children}
        </Button>
    )
}

export default ActionButton
