import {getShortExpiryProducts} from "@dal";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Link from "next/link";
import EditProductDialog from "@/components/custom/products/editProductDialog";
import DeleteProductButton from "@/components/custom/products/deleteProductButton";
import {getSessionProfileOrRedirect} from "@mediators";

interface PageProps {

}

export default async function ShortExpiryPage() {
    const profile = await getSessionProfileOrRedirect()
    const products = await getShortExpiryProducts(profile.groupId)

    return (
        <div className="w-full p-6">
            <h1 className="text-2xl font-bold mb-4">Korte THT</h1>
            {products.length === 0 ? (
                <p>Er zijn geen producten met korte THT.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead>Naam</TableHead>
                            <TableHead>Merk</TableHead>
                            <TableHead>Vervaldatum</TableHead>
                            <TableHead>Acties</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map(p => (
                            <TableRow key={p.id}>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>{p.brand}</TableCell>
                                <TableCell>{p.expiryDate?.toLocaleDateString()}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Link href={`/products/${p.id}`}>
                                        <button className="text-gray-600 hover:text-gray-800">Bekijk</button>
                                    </Link>
                                    {/*<EditProductDialog product={p} />*/}
                                    <DeleteProductButton productId={p.id}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}