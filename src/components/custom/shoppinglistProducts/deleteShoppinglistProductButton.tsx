'use client'
import ActionButton from '@/components/custom/button/actionButton'
import Actions from '@actions'
import {Trash2} from 'lucide-react'

interface DeleteShoppinglistProductButtonProps {
    shoppinglistId: string
    productId: string}

export default function DeleteShoppinglistProductButton({shoppinglistId, productId}: DeleteShoppinglistProductButtonProps) {
    return (
        <ActionButton
            action={() => Actions.deleteShoppinglistProduct({shoppinglistId, productId})}
            variant="destructive"
            // pendingContent="Verwijderen"
            size='sm'
        >
            <Trash2 size={14} />

        </ActionButton>
    )
}
