import DetailProduct from '@/components/custom/products/detailProduct'
import {getSessionProfileOrRedirect} from '@mediators'
import {getProductById} from '@dal'
import PurchaseHistory from '@/components/custom/products/purchaseHistory'

export default async function ProductPage({params}: { params: { productId: string }})  {
    const { productId } = await params

    const profile = await getSessionProfileOrRedirect()
    const product = await getProductById(productId, profile.groupId)

    if(!product || product.groupId !== profile.groupId) {
        return (
            <p>Product niet gevonden</p>
        )
    }

// Bepaal of deze user dit product als favoriet heeft
    const userFavourite = product.userFavouriteProducts.some(
        (uf) => uf.userId === profile.id
    )
    return (
        <div>
            <DetailProduct
                product={{ ...product, userFavourite }}
            />
            <div className="mt-5">
                <PurchaseHistory productEntries={product.productEntries} />
            </div>
        </div>
    )
}

