import {getSessionProfileOrRedirect} from '@mediators'
import {getCategoryById, getProductsByCategory} from '@dal'
import {notFound} from 'next/navigation'
import OverviewProducts from '@/components/custom/products/OverviewProducts'

interface CategoryPageProps {
    params: Promise<{ categoryId: string }>
}

// export const metadata = ({ params }: CategoryPageProps): Metadata => ({
//     title: `Categorie • ${params.categoryId}`,
// })

export default async function CategoryPage({params}: CategoryPageProps) {
    const { categoryId } = await params

    const profile = await getSessionProfileOrRedirect()
    const category = await getCategoryById(categoryId, profile.groupId)
    if (!category) {
        return notFound()
    }

    //3 fetch products
    const products = await getProductsByCategory(profile.groupId, categoryId)


    return (
        <>
            <h1>Categorie: {category.name}</h1>
            {products.length === 0 ? <p>Geen producten in deze categorie</p> :
            <OverviewProducts products={products}/>}
        </>
    )
}

