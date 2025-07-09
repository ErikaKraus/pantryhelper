'use client'

import {ProductEntry} from '@prisma/client'
import {Table, TableBody, TableCell, TableHeader, TableRow} from '@/components/ui/table'
import {Card} from '@/components/ui/card'

interface PurchaseHistoryProps {
    productEntries: ProductEntry[]
}

export default function PurchaseHistory({productEntries}: PurchaseHistoryProps) {
    if(productEntries.length === 0) return (
            <Card className="w-full">
                <h1 className="text-3xl font-bold">Aankoopgeschiedenis</h1>
                <p>Er zijn nog geen aankopen geregistreerd.</p>
            </Card>
    )

    return (
        <Card>
            <h1 className="text-3xl font-bold">Aankoopgeschiedenis</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell>Aankoopdatum</TableCell>
                        <TableCell>Houdbaarheidsdatum</TableCell>
                        <TableCell>Aantal</TableCell>
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
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

