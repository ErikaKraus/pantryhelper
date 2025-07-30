'use client'
import {FunctionComponent, useMemo, useState} from 'react'
import {Category, Product} from '@prisma/client'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import Link from 'next/link'
import {Eye} from 'lucide-react'
import DeleteProductButton from '@/components/custom/products/deleteProductButton'
import EditProductDialog from '@/components/custom/products/editProductDialog'
import {Button} from '@/components/ui/button'
import AddToShoppinglistProductDialog from '@/components/custom/shoppinglistProducts/addToShoppinglistProductDialog'
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";

interface OverviewProductsProps {
    products: Array<Product & { categories: Category[] }>
    categories: Category[]
    shoppinglists: { id: string; name: string }[]
    favouriteIds: string[]
}

const OverviewProducts: FunctionComponent<OverviewProductsProps> = ({products, categories, shoppinglists, favouriteIds}) => {
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all')
    const [onlyFavourites, setOnlyFavourites] = useState(false)

    // memoiseer filtered list
    const filtered = useMemo(() => {
        return products
            // 1) filter op naam
            .filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase())
            )
            // 2) filter op categorie
            .filter(p =>
                selectedCategory === 'all' ||
                p.categories.some(c => c.id === selectedCategory)
            )
            // 3) filter op favourites
            .filter(p =>
                !onlyFavourites ||
                favouriteIds.includes(p.id)
            )
    }, [products, search, selectedCategory, onlyFavourites, favouriteIds])

    return (
        <div className="space-y-4">
            {/* --- Filter controls --- */}
            <div className="flex flex-wrap gap-4 items-center">
                {/* Zoek op naam */}
                <Input
                    placeholder="Zoek op naam…"
                    value={search}
                    onChange={e => setSearch(e.currentTarget.value)}
                    className="flex-1 min-w-[200px]"
                />

                {/* Filter op categorie */}
                <Select
                    value={selectedCategory}
                    onValueChange={(val) => setSelectedCategory(val)}
                >
                    <SelectTrigger className="min-w-[180px]">
                        <SelectValue placeholder="Alle categorieën" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Categorie</SelectLabel>
                            <SelectItem value="all">Alles</SelectItem>
                            {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {/* Alleen favorieten */}
                <label className="inline-flex items-center space-x-2">
                    <Checkbox
                        checked={onlyFavourites}
                        onCheckedChange={val => setOnlyFavourites(!!val)}
                    />
                    <span>Alleen favorieten</span>
                </label>
            </div>
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
                {filtered.map(product => (
                    <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.numberOfItems}</TableCell>
                        <TableCell className="flex gap-2" >
                            <Link href={`/products/${product.id}`}>
                                <Button className="text-gray-600 hover:text-gray-800"  size="sm"   variant="outline"
                                >
                                    <Eye size={20} />
                                </Button>
                            </Link>
                            <EditProductDialog product={product} allCategories={categories}/>
                            <DeleteProductButton productId={product.id}/>
                            <AddToShoppinglistProductDialog
                                productId={product.id}
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

export default OverviewProducts
