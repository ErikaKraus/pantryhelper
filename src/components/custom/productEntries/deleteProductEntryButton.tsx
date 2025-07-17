'use client'
import ActionButton from '@/components/custom/button/actionButton'
import Actions from '@actions'
import {Trash, Trash2} from 'lucide-react'

interface DeleteProductEntryButtonProps {
    productEntryId: string
    productId: string
}

export default function DeleteProductEntryButton({productEntryId, productId}: DeleteProductEntryButtonProps) {
    return (
        <ActionButton
            action={() => Actions.deleteProductEntry({id: productEntryId, productId})}
            variant="destructive"
            pendingContent={<Trash2 className="animate-spin h-4 w-4" />}
            size='sm'
        >
            <Trash2 size={16}/>
        </ActionButton>
    )
}
