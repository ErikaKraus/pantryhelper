'use client'

import {ProductEntry} from '@prisma/client'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Card} from '@/components/ui/card'
import DeleteProductEntryButton from '@/components/productEntries/deleteProductEntryButton'


interface PurchaseHistoryProps {
    productEntries: ProductEntry[]
}

export default function PurchaseHistory({productEntries}: PurchaseHistoryProps) {
    if(productEntries.length === 0) return (
            <Card className="w-full p-6">
                <h1 className="text-xl font-bold">Aankoopgeschiedenis</h1>
                <p>Er zijn nog geen aankopen geregistreerd.</p>
            </Card>
    )

    return (
        <Card className="p-6">
            <h1 className="text-xl font-bold">Aankoopgeschiedenis</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Aankoopdatum</TableHead>
                        <TableHead>Houdbaarheidsdatum</TableHead>
                        <TableHead>Aantal</TableHead>
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
                            <TableCell>{productEntry.quantity}</TableCell>
                            <TableCell>
                                <DeleteProductEntryButton productEntryId={productEntry.id} productId={productEntry.productId} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

