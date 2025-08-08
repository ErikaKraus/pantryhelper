'use client'

import {ProductEntry} from '@prisma/client'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Card} from '@/components/ui/card'
import DeleteProductEntryButton from '@/components/custom/productEntries/deleteProductEntryButton'
import EditProductEntryDialog from '@/components/custom/productEntries/editProductEntryDialog'
import {useTransition} from "react";
import {updateRemainingQuantity} from "@actions";
import {Button} from "@/components/ui/button";


interface PurchaseHistoryProps {
    productEntries: ProductEntry[]
}

export default function PurchaseHistory({productEntries}: PurchaseHistoryProps) {
    const [isPending, startTransition] = useTransition()

    if(productEntries.length === 0) return (
            <Card className="w-full p-6">
                <h1 className="text-xl font-bold">Aankoopgeschiedenis</h1>
                <p>Er zijn nog geen aankopen geregistreerd.</p>
            </Card>
    )

    const handleUpdate = (productEntryId: string, newValue: number) => {
        if (newValue < 0) return
        startTransition(() => {
            updateRemainingQuantity({id: productEntryId, newValue})
        })
    }

    return (
        <Card className="p-6">
            <h1 className="text-xl font-bold">Aankoopgeschiedenis</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Aankoopdatum</TableHead>
                        <TableHead>Houdbaarheidsdatum</TableHead>
                        <TableHead>Gekocht</TableHead>
                        <TableHead>Resterend</TableHead>
                        <TableHead>Acties</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productEntries.map(productEntry => (
                        <TableRow key={productEntry.id}>
                            <TableCell> {productEntry.purchaseDate
                                ? new Date(productEntry.purchaseDate).toLocaleDateString('nl-BE', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })
                                : '–'}</TableCell>
                            <TableCell> {productEntry.expiryDate
                                ? new Date(productEntry.expiryDate).toLocaleDateString('nl-BE', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })
                                : '–'}</TableCell>
                            <TableCell>{productEntry.boughtQuantity}</TableCell>
                            <TableCell><div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleUpdate(productEntry.id, productEntry.remainingQuantity - 1)}
                                    disabled={isPending || productEntry.remainingQuantity === 0}
                                >
                                    –
                                </Button>
                                <span>{productEntry.remainingQuantity}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleUpdate(productEntry.id, productEntry.remainingQuantity + 1)}
                                    disabled={isPending}
                                >
                                    +
                                </Button>
                            </div></TableCell>
                            <TableCell className="flex gap-2">
                                <EditProductEntryDialog productEntry={productEntry} productId={productEntry.productId} />
                                <DeleteProductEntryButton productEntryId={productEntry.id} productId={productEntry.productId} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

