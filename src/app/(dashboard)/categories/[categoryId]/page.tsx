import {getSessionProfileOrRedirect} from '@mediators'
import {getCategoryById, getProductsByCategory} from '@dal'
import {notFound} from 'next/navigation'
import OverviewProducts from '@/components/custom/products/OverviewProducts'
import DeleteCategoryButton from '@/components/custom/categories/deleteCategoryButton'
import EditCategoryDialog from '@/components/custom/categories/editCategoryDialog'

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
        <div className="w-full p-6">
            <div className="flex w-full items-center justify-between mb-4">
                <h1 className="flex-1 text-2xl font-bold">{category.name}</h1>
                <div className="flex space-x-2">
                    <EditCategoryDialog categoryId={category.id} currentName={category.name} />
                    <DeleteCategoryButton categoryId={categoryId} />
                </div>
            </div>

    {products.length === 0 ? (
                <p>Er zijn nog geen producten in deze categorie.</p>
            ) : (
                <OverviewProducts products={products} categories={[]} />
            )}
        </div>
    )
}

