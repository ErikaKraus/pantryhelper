import {getSessionProfileOrRedirect} from '@mediators'
import { getAllProducts} from '@dal'
import OverviewProducts from '@/components/custom/products/OverviewProducts'

interface ProductsPageProps {
    searchParams: Promise<{q?: string, category?:string}>
}

export default async function ProductsPage() {
    const profile = await getSessionProfileOrRedirect()
    const products = await getAllProducts(profile.groupId)

    return (
        <div className="w-full p-6">
            <h1 className="text-2xl font-bold">Voorraad</h1>
            {products.length === 0 ? (
                <p>Er zijn nog geen producten.</p>
            ) : (
                <OverviewProducts products={products} />
            )}
        </div>
    )
}

