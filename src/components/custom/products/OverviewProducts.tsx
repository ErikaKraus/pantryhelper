'use client'
import {FunctionComponent} from 'react'
import {Category, Product} from '@prisma/client'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import Link from 'next/link'
import {Eye} from 'lucide-react'
import DeleteProductButton from '@/components/custom/products/deleteProductButton'
import EditProductDialog from '@/components/custom/products/editProductDialog'
import {Button} from '@/components/ui/button'

interface OverviewProductsProps {
    products: Product[]
    categories: Category[]
}

const OverviewProducts: FunctionComponent<OverviewProductsProps> = ({products, categories}) => {

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
                        <TableCell className="flex gap-2" >
                            <Link href={`/products/${product.id}`}>
                                <Button className="text-gray-600 hover:text-gray-800" title="Bekijk" size="sm"   variant="outline"
                                >
                                    <Eye size={20} />
                                </Button>
                            </Link>
                            <EditProductDialog product={product} allCategories={categories}/>
                            <DeleteProductButton productId={product.id}/>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
    )
}

export default OverviewProducts
