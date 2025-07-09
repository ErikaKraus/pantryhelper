'use client'
import ActionButton from '@/components/custom/button/actionButton'
import Actions from '@actions'
import {Trash2} from 'lucide-react'

interface DeleteProductButtonProps {
    productId: string
}

export default function DeleteProductButton({productId}: DeleteProductButtonProps) {
    return (
        <ActionButton
            action={() => Actions.deleteProduct({id: productId})}
            variant="destructive"
            pendingContent="Verwijderen"
            size='sm'
        >
            <Trash2 size={16}/>

        </ActionButton>
    )
}
