'use client'

import ActionButton from '@/components/custom/button/actionButton'
import { toggleRestock } from '@actions'
import {Trash2} from 'lucide-react'

interface LowStockActionsProps {
    productId: string
}

export default function LowStockActions({ productId }: LowStockActionsProps) {
    return (
        <ActionButton
            action={() => toggleRestock({ id: productId, needsRestock: false })}
            variant="outline"
            size="sm"
            // pendingContent="…Verwijderen"
        >
            <Trash2 size={16}/>
        </ActionButton>
    )
}
