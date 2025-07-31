import {getShortExpiryProductEntries} from "@dal";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Link from "next/link";
import DeleteProductButton from "@/components/custom/products/deleteProductButton";
import {getSessionProfileOrRedirect} from "@mediators";
import {Button} from "@/components/ui/button";
import {Eye} from "lucide-react";

export default async function ShortExpiryPage() {
    const profile = await getSessionProfileOrRedirect()
    const entries = await getShortExpiryProductEntries(profile.groupId)

    return (
        <div className="w-full p-6">
            <h1 className="text-2xl font-bold mb-4">Producten met korte THT</h1>
            {entries.length === 0 ? (
                <p>Er zijn geen producten met korte THT.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead>Naam</TableHead>
                            <TableHead>Merk</TableHead>
                            <TableHead>Aantal</TableHead>
                            <TableHead>Vervaldatum</TableHead>
                            <TableHead>Acties</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries.map(entry => (
                            <TableRow key={entry.id}>
                                <TableCell>{entry.product.name}</TableCell>
                                <TableCell>{entry.product.brand}</TableCell>
                                <TableCell>{entry.product.numberOfItems}</TableCell>
                                <TableCell>{entry.expiryDate?.toLocaleDateString()}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Link href={`/products/${entry.product.id}`}>
                                        <Button className="text-gray-600 hover:text-gray-800"  size="sm"   variant="outline"
                                        >
                                            <Eye size={20} />
                                        </Button>
                                    </Link>
                                    {/*<EditProductDialog product={p} />*/}
                                    <DeleteProductButton productId={entry.product.id}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}