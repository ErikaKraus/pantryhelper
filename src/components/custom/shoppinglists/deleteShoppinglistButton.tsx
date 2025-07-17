'use client'
import ActionButton from '@/components/custom/button/actionButton'
import Actions from '@actions'

interface DeleteShoppinglistButtonProps {
    shoppinglistId: string
}

export default function DeleteShoppinglistButton({shoppinglistId}: DeleteShoppinglistButtonProps) {
    return (
        <ActionButton
            action={() => Actions.deleteShoppinglist({id: shoppinglistId})}
            variant="destructive"
            pendingContent="Verwijderen"
            size='sm'
        >
            Verwijderen
        </ActionButton>
    )
}
