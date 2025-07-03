import { ProductEntry} from '@prisma/client'
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

export async function deleteProductEntry(id: string): Promise<void> {
    await prismaClient.productEntry.delete({
        where: {id},
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