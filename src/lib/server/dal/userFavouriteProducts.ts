import { UserFavouriteProduct } from '@prisma/client'
import 'server-only'
import {prismaClient} from '@/lib/server/dal/prismaClient'

export type CreateUserFavouriteProductParams = {
    userId: string,
    productId: string,
}

/**
 * Voeg een product toe aan de favorieten van een gebruiker.
 * Prisma gebruikt het unieke index-[userId, productId] om dubbele entries tegen te gaan.
 */
export async function createUserFavouriteProduct(params: CreateUserFavouriteProductParams): Promise<UserFavouriteProduct> {
    return prismaClient.userFavouriteProduct.create({
        data: {
            userId: params.userId,
            productId: params.productId,
        }
    })
}

/**
 * Verwijder een favoriet product voor een gebruiker.
 * We gebruiken hier de samengestelde unieke constraint `userId_productId`.
 */
export async function deleteUserFavouriteProduct(userId: string, productId: string): Promise<void> {
    await prismaClient.userFavouriteProduct.delete({
        where: {
            userId_productId: {
                userId,
                productId,
            }
        }
    })
}

/**
 * Haal alle favoriete producten op voor een bepaalde gebruiker.
 * Optioneel includen we meteen de volledige productgegevens.
 */
export async function getAllUserFavouriteProducts(userId: string): Promise<UserFavouriteProduct[]> {
    return prismaClient.userFavouriteProduct.findMany({
        where: {
            userId,
        },
        orderBy: {
            productId: 'asc',
        },
        include: {product: true}
    })
}

/**
 * Haal één specifieke favorite entry op (of null als die niet bestaat).
 * Handig om te checken of een product al favoriet is.
 */
export async function getProductById(userId: string, productId: string): Promise<UserFavouriteProduct | null> {
    return prismaClient.userFavouriteProduct.findUnique({
        where: {
            userId_productId: {
                userId,
                productId,
            }
        },
    })
}