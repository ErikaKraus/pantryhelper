'use client'
import {FunctionComponent, useActionState, useTransition} from 'react'
import {ShoppinglistProduct} from '@prisma/client'
import Actions from '@actions'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {Minus, Plus} from 'lucide-react'
import DeleteShoppinglistProductButton from '@/components/custom/shoppinglistProducts/deleteShoppinglistProductButton'

interface ItemWithProduct extends ShoppinglistProduct {
    product: {
        id: string
        name: string
        brand: string
        numberOfItems: number
    }
}

interface OverviewShoppinglistProductsProps {
    shoppinglistId: string
    items: ItemWithProduct[]
}

const OverviewShoppinglistProducts: FunctionComponent<OverviewShoppinglistProductsProps> = ({shoppinglistId, items}) => {
    const [isPendingTransition, startTransition] = useTransition()

    const [ , updateItem, isUpdating ] = useActionState(
        Actions.updateShoppinglistProduct,
        { success: false }
    )

    const adjustQty = (productId: string, newQty: number) => {
        if (newQty < 1) return

        // NU in een transition:
        startTransition(() => {
            const fd = new FormData()
            fd.set('shoppinglistId', shoppinglistId)
            fd.set('productId', productId)
            fd.set('quantity', newQty.toString())
            updateItem(fd)
        })
    }

    const busy = isUpdating || isPendingTransition


    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-gray-100">
                    <TableHead>Naam</TableHead>
                    <TableHead>Merk</TableHead>
                    <TableHead>Voorraad</TableHead>
                    <TableHead>Aantal</TableHead>
                    <TableHead>Acties</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map(({ product, quantity }) => (
                    <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.numberOfItems}</TableCell>

                        {/* ── Kolom met – [aantal] + ── */}
                        <TableCell className="flex items-center space-x-2">
                            <Button
                                size="icon"
                                variant="outline"
                                disabled={busy}
                                onClick={() => adjustQty(product.id, quantity - 1)}
                            >
                                <Minus size={14} />
                            </Button>
                            <span>{quantity}</span>
                            <Button
                                size="icon"
                                variant="outline"
                                disabled={busy}
                                onClick={() => adjustQty(product.id, quantity + 1)}
                            >
                                <Plus size={14} />
                            </Button>
                        </TableCell>

                        {/* ── Verwijder uit deze lijst ── */}
                        <TableCell>
                            <DeleteShoppinglistProductButton shoppinglistId={shoppinglistId} productId={product.id} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default OverviewShoppinglistProducts
