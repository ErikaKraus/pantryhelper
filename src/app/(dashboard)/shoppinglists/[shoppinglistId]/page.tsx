import {getSessionProfileOrRedirect} from '@mediators'
import {getAllShoppinglistProducts, getShoppinglistById} from '@dal'
import {notFound} from 'next/navigation'
import EditShoppinglistDialog from '@/components/custom/shoppinglists/editShoppinglistDialog'
import DeleteShoppinglistButton from '@/components/custom/shoppinglists/deleteShoppinglistButton'
import OverviewShoppinglistProducts from '@/components/custom/shoppinglistProducts/overviewShoppinglistProducts'
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
    const items = await getAllShoppinglistProducts(shoppinglistId)

    return (
        <div className="w-full p-6">
            <div className="flex w-full items-center justify-between mb-4">
                <h1 className="flex-1 text-2xl font-bold">{shoppinglist.name}</h1>
                <div className="flex space-x-2">
                    <EditShoppinglistDialog shoppinglistId={shoppinglist.id} currentName={shoppinglist.name} />
                    <DeleteShoppinglistButton shoppinglistId={shoppinglistId} />
                </div>
            </div>
            {items.length === 0 ? (
                <p>Er zitten nog geen producten in dit boodschappenlijstje.</p>
            ) : (
                <OverviewShoppinglistProducts items={items} shoppinglistId={shoppinglistId} />
            )}

        </div>
    )
}

