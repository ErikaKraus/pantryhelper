import {FunctionComponent} from 'react'
import {getSessionProfileOrRedirect} from '@mediators'
import {getShoppinglistById} from '@dal'
import {notFound} from 'next/navigation'
import EditCategoryDialog from '@/components/custom/categories/editCategoryDialog'
import DeleteCategoryButton from '@/components/custom/categories/deleteCategoryButton'
import OverviewProducts from '@/components/custom/products/OverviewProducts'

interface ShoppinglistPageProps {
    params: Promise<{ shoppinglistId: string }>

}

export default async function ShoppinglistPage({params}: ShoppinglistPageProps)  {
    const { shoppinglistId } = await params

    const profile = await getSessionProfileOrRedirect()
    const shoppinglist = await getShoppinglistById(shoppinglistId, profile.groupId)
    if (!shoppinglist) {
        return notFound()
    }
    return (
        <div className="w-full p-6">
            <div className="flex w-full items-center justify-between mb-4">
                <h1 className="flex-1 text-2xl font-bold">{shoppinglist.name}</h1>

            </div>


        </div>
    )
}

