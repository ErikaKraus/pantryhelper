'use client'

import { useTransition, useState } from 'react'
import { ProductEntry } from '@prisma/client'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { updateRemainingQuantity } from '@actions'
import Link from "next/link";
import {Eye} from "lucide-react";
import {useRouter} from "next/navigation";
import DeleteProductEntryButton from "@/components/custom/productEntries/deleteProductEntryButton";

interface ExpiringEntriesListProps {
    productEntries: Array<
        ProductEntry & {
        product: {
            id: string
            name: string
            brand: string
            numberOfItems: number
        }
    }
    >
}

export default function ExpiringEntriesList({ productEntries }: ExpiringEntriesListProps) {
    // Only show productEntries with remainingQuantity > 0
    const [entries, setEntries] = useState(() =>
        productEntries.filter(e => e.remainingQuantity > 0)
    )
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleUpdate = (entryId: string, newValue: number) => {
        if (newValue < 0) return

        startTransition(async () => {
            await updateRemainingQuantity({ id: entryId, newValue })

            setEntries(prev =>
                newValue === 0
                    ? prev.filter(e => e.id !== entryId) // remove from list
                    : prev.map(e => (e.id === entryId ? { ...e, remainingQuantity: newValue } : e))
            )
        })
    }

    if (entries.length === 0) {
        return (
            <div className="p-6">
                <h1 className="text-xl font-bold">Producten met korte houdbaarheid</h1>
                <p className="text-muted-foreground">Er zijn geen producten met korte houdbaarheidsdatum.</p>
            </div>
        )
    }

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Producten met korte houdbaarheid</h1>
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-100" >
                        <TableHead>Product</TableHead>
                        <TableHead>Merk</TableHead>
                        <TableHead>Houdbaarheidsdatum</TableHead>
                        <TableHead>Resterend</TableHead>
                        <TableHead>Acties</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entries.map(entry => (
                        <TableRow
                            key={entry.id}
                            className={entry.expiryDate && new Date(entry.expiryDate) < new Date() ? 'bg-red-100' : ''}
                        >
                            <TableCell>{entry.product.name}</TableCell>
                            <TableCell>{entry.product.brand}</TableCell>
                            <TableCell>
                                {entry.expiryDate
                                    ? new Date(entry.expiryDate).toLocaleDateString('nl-BE', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })
                                    : '–'}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => handleUpdate(entry.id, entry.remainingQuantity - 1)}
                                        disabled={isPending || entry.remainingQuantity === 0}
                                    >
                                        –
                                    </Button>
                                    <span>{entry.remainingQuantity}</span>
                                    {/*<Button*/}
                                    {/*    size="icon"*/}
                                    {/*    variant="outline"*/}
                                    {/*    onClick={() => handleUpdate(entry.id, entry.remainingQuantity + 1)}*/}
                                    {/*    disabled={isPending}*/}
                                    {/*>*/}
                                    {/*    +*/}
                                    {/*</Button>*/}
                                </div>
                            </TableCell>
                            <TableCell className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(`/products/${entry.product.id}`)}>
                                    <Eye size={16} />
                                </Button>
                                <DeleteProductEntryButton productEntryId={entry.id} productId={entry.productId} />

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
