'use client'
import { useState, useEffect, useTransition } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label }    from '@/components/ui/label'
import { toggleRestock } from '@actions'

interface RestockToggleProps {
    productId: string
    needsRestockInitial: boolean
}

export default function RestockToggle({
                                          productId,
                                          needsRestockInitial,
                                      }: RestockToggleProps) {
    const [checked, setChecked] = useState(needsRestockInitial)
    const [isPending, startTransition] = useTransition()

    // synchroniseer lokale state als de prop verandert
    useEffect(() => {
        setChecked(needsRestockInitial)
    }, [needsRestockInitial])

    const onChange = (val: boolean) => {
        // direct lokale state updaten, zodat de UI reageert
        setChecked(val)

        // en in een transition de server call doen
        startTransition(() => {
            // toggleRestock is een serverFunction: het neemt een object {id, needsRestock}
            return toggleRestock({ id: productId, needsRestock: val })
        })
    }

    return (
        <div className="flex items-center space-x-2">
            <Checkbox
                checked={checked}
                onCheckedChange={onChange}
                disabled={isPending}
            />
            <Label>Restock</Label>
        </div>
    )
}
