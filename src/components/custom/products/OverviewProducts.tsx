'use client'
import {FunctionComponent} from 'react'
import {Product} from '@prisma/client'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import Link from 'next/link'
import {Eye} from 'lucide-react'

interface OverviewProductsProps {
products: Product[]
}

const OverviewProducts: FunctionComponent<OverviewProductsProps> = ({products}) => {
    return (
        <div className="overflow-x-auto w-full">

        <Table>
            <TableHeader>
                <TableRow className="bg-gray-100">
                    <TableHead className="px-4 py-2">Naam</TableHead>
                    <TableHead className="px-4 py-2">Merk</TableHead>
                    <TableHead className="px-4 py-2">Voorraad</TableHead>
                    <TableHead className="px-4 py-2">Acties</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map(product => (
                    <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.numberOfItems}</TableCell>
                        <TableCell>
                            <Link href={`/products/${product.id}`}>
                                <button className="text-gray-600 hover:text-gray-800" title="Bekijk">
                                    <Eye size={20} />
                                </button>
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
    )
}

export default OverviewProducts
