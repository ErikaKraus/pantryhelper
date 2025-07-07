'use client'
import ActionButton from '@/components/custom/button/actionButton'
import Actions from '@actions'

interface DeleteCategoryButtonProps {
categoryId: string
}

export default function DeleteCategoryButton({categoryId}: DeleteCategoryButtonProps) {
    return (
        <ActionButton
            action={() => Actions.deleteCategory({id: categoryId})}
            variant="destructive"
            pendingContent="Verwijderen"
        >
            Verwijderen
        </ActionButton>
    )
}
