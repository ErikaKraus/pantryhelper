import {Product, ProductEntry} from '@prisma/client'
import 'server-only'
import {prismaClient} from '@/lib/server/dal/prismaClient'

export type CreateProductEntryParams = {
    productId: string,
    quantity: number,
    purchaseDate?: Date | string | null,
    expiryDate?: Date | string | null,
}

export type UpdateProductEntryParams = {
    id: string
    quantity?: number
    purchaseDate?: Date | string | null,
    expiryDate?: Date | string | null,
}

export async function createProductEntry(params: CreateProductEntryParams): Promise<ProductEntry> {
    return prismaClient.productEntry.create({
        data: {
            product: {connect: {id: params.productId}},
            quantity: params.quantity,
            purchaseDate: params.purchaseDate ? new Date(params.purchaseDate) : undefined,
            expiryDate: params.expiryDate ? new Date(params.expiryDate) : undefined,
        }
    })
}

export async function updateProductEntry(params: UpdateProductEntryParams): Promise<ProductEntry> {
    const {id, ...data} = params
    return prismaClient.productEntry.update({
        where: {id},
        data: {
            ...('quantity' in data && { quantity: data.quantity }),
            ...('purchaseDate' in data && { purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null }),
            ...('expiryDate' in data && { expiryDate: data.expiryDate ? new Date(data.expiryDate) : null }),
        }
    })
}

export async function deleteProductEntry(id: string): Promise<{ productId: string; quantity: number }> {
    return await prismaClient.productEntry.delete({
        where: {id},
        select: {
            productId: true,
            quantity: true
        }
    })
}

export async function getProductEntryById(id: string): Promise<ProductEntry | null> {
    return prismaClient.productEntry.findUnique({
        where: {id}
    })
}

export async function getAllProductEntries(productId: string): Promise<ProductEntry[]> {
    return prismaClient.productEntry.findMany({
        where: {productId},
        orderBy: {purchaseDate: 'desc'}
    })
}

export async function getShortExpiryProductEntries(groupId: string, daysAhead = 30): Promise<
    Array<
        ProductEntry & {
        product: { id: string; name: string; brand: string; numberOfItems: number }
    }>
> {
    const now = new Date()
    const threshold = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000)
    return prismaClient.productEntry.findMany({
        where: {
            product: {groupId},
            // alleen producten met een expiryDate ≤ threshold
            expiryDate: {
                not: null,
                lte: threshold,
            },
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    brand: true,
                    numberOfItems: true,
                },
            },
        },
        orderBy: { expiryDate: 'asc' },
        distinct: ['productId'],
    })
}
