'use client'
import {FunctionComponent} from 'react'
import {Product} from '@prisma/client'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'

interface OverviewProductsProps {
products: Product[]
}

const OverviewProducts: FunctionComponent<OverviewProductsProps> = ({products}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Naam</TableHead>
                    <TableHead>Merk</TableHead>
                    <TableHead>Voorraad</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map(product => (
                    <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.numberOfItems}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default OverviewProducts
