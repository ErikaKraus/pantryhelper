import {getSessionProfileOrRedirect} from '@mediators'
import {getAllCategories, getAllProducts} from '@dal'
import OverviewProducts from '@/components/custom/products/OverviewProducts'
import AddProductDialog from '@/components/custom/products/addProductDialog'

interface ProductsPageProps {
    searchParams: Promise<{q?: string, category?:string}>
}

export default async function ProductsPage() {
    const profile = await getSessionProfileOrRedirect()
    const products = await getAllProducts(profile.groupId)
    const allCategories = await getAllCategories(profile.groupId)

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Producten</h1>
                <div className="mb-3">
                    <AddProductDialog categories={allCategories} />
                </div>
            </div>            {products.length === 0 ? (
                <p>Er zijn nog geen producten.</p>
            ) : (
                <OverviewProducts products={products} categories={allCategories} />
            )}
        </div>
    )
}

