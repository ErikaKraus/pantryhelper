// src/app/products/lowstock/page.tsx
import { getSessionProfileOrRedirect } from '@mediators'
import { getLowStockProducts } from '@dal'
import { getAllShoppinglists } from '@dal'
import Link from 'next/link'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import ActionButton from '@/components/custom/button/actionButton'
import { toggleRestock } from '@actions'
import AddToShoppinglistProductDialog from '@/components/custom/shoppinglistProducts/addToShoppinglistProductDialog'
import DeleteFromLowStockButton from '@/components/custom/products/deleteFromLowStockButton'

export default async function LowStockPage() {
    const profile = await getSessionProfileOrRedirect()
    const products     = await getLowStockProducts(profile.groupId)
    const shoppinglists = await getAllShoppinglists(profile.groupId)

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Weinig voorraad</h1>

            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead>Naam</TableHead>
                        <TableHead>Merk</TableHead>
                        <TableHead>Voorraad</TableHead>
                        <TableHead>Acties</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {products.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{p.brand}</TableCell>
                            <TableCell>{p.numberOfItems}</TableCell>

                            <TableCell className="flex gap-2">
                                {/* 1) Bekijken */}
                                <Link href={`/products/${p.id}`}>
                                    <Button variant="outline" size="sm" title="Bekijk">
                                        <Eye size={16} />
                                    </Button>
                                </Link>

                                {/* 2) Uit low‑stock lijst halen */}
                                <DeleteFromLowStockButton productId={p.id} />


                                {/* 3) Toevoegen aan boodschappenlijst */}
                                <AddToShoppinglistProductDialog
                                    productId={p.id}
                                    shoppinglists={shoppinglists}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
