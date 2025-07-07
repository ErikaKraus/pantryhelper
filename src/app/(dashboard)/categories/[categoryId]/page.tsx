import {getSessionProfileOrRedirect} from '@mediators'
import {getCategoryById, getProductsByCategory} from '@dal'
import {notFound} from 'next/navigation'
import OverviewProducts from '@/components/custom/products/OverviewProducts'
import DeleteCategoryButton from '@/components/custom/button/categories/deleteCategoryButton'
import EditCategoryDialog from '@/components/custom/dialog/editCategoryDialog'

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
        <div className="p-6">
            <div className="flex w-full items-center mb-4 justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{category.name}</h1>
                </div>
                <div className="flex gap-2">
                    <EditCategoryDialog categoryId={categoryId} currentName={category.name}/>
                    <DeleteCategoryButton categoryId={categoryId}/>
                </div>
            </div>

            {products.length === 0 ? <p>Geen producten in deze categorie</p> :
            <OverviewProducts products={products}/>}
        </div>
    )
}

