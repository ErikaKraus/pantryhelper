import { ShoppinglistProduct } from '@prisma/client'
import 'server-only'
import {prismaClient} from '@/lib/server/dal/prismaClient'

export type CreateShoppinglistProductParams = {
    shoppinglistId: string,
    productId: string,
    quantity: number,
}

export type UpdateShoppinglistProductParams = CreateShoppinglistProductParams

export async function createShoppinglistProduct(params: CreateShoppinglistProductParams): Promise<ShoppinglistProduct> {
    return prismaClient.shoppinglistProduct.create({
        data: {
            shoppinglist: {
                connect: {
                    id: params.shoppinglistId
                }
            },
            product: {
                connect: {
                    id: params.productId
                }
            },
            quantity: params.quantity ?? 1,
        }
    })
}

export async function updateShoppinglistProduct(params: UpdateShoppinglistProductParams): Promise<ShoppinglistProduct> {
    return prismaClient.shoppinglistProduct.update({
        where: {
            shoppinglistId_productId: {
                shoppinglistId: params.shoppinglistId,
                productId: params.productId,
            }
        },
        data: {
            quantity: params.quantity,
        }
    })
}

export async function deleteShoppinglistProduct(params: {shoppinglistId: string; productId: string}): Promise<void> {
    await prismaClient.shoppinglistProduct.delete({
        where: {
            shoppinglistId_productId: {
                shoppinglistId: params.shoppinglistId,
                productId: params.productId,
            }
        },
    })
}

export async function getAllShoppinglistProducts(shoppinglistId: string): Promise<ShoppinglistProduct[]> {
    return prismaClient.shoppinglistProduct.findMany({
        where: {
            shoppinglistId,
        },
        orderBy: {
            productId: 'asc',
        }
    })
}