import {getSessionProfileOrRedirect} from '@mediators'
import {getAllShoppinglists} from '@dal'
import AddShoppinglistDialog from '@/components/custom/shoppinglists/addShoppinglistDialog'
import ShoppinglistCard from '@/components/custom/card/ShoppinglistCard'

interface ShoppinglistPageProps {

}

export default async function ShoppinglistPage ()  {
    const profile = await getSessionProfileOrRedirect()
    const shoppinglists = await getAllShoppinglists(profile.groupId)

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Boodschappenlijstjes</h1>
                <AddShoppinglistDialog />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {shoppinglists.map(shoppinglist => (
                    <ShoppinglistCard key={shoppinglist.id} title={shoppinglist.name} link={`/shoppinglists/${shoppinglist.id}`}  />
                ))}
            </div>
        </div>
    )
}

