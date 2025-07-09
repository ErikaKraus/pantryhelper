import 'server-only'
import {prismaClient} from '@/lib/server/dal/prismaClient'
import {Category, Prisma, Product, ProductEntry, ShoppinglistProduct, UserFavouriteProduct, Ingredient} from '@prisma/client'

export type CreateProductParams = Prisma.ProductCreateInput
export type UpdateProductParams = Prisma.ProductUpdateInput

export type ProductWithRels = Product & {
    categories: Category[]
    shoppinglistProducts: ShoppinglistProduct[]
    ingredients: Ingredient[]
    productEntries: ProductEntry[]
    userFavouriteProducts: UserFavouriteProduct[]
}

export async function createProduct(data: CreateProductParams) {
    return prismaClient.product.create({
        data,
        include: {
            categories: true,
            group: true
        }
    })
}

export async function updateProduct(id: string, data: UpdateProductParams) {
    return prismaClient.product.update({
        where: {id},
        data,
        include: {
            categories: true,
            group: true
        }
    })
}

export async function deleteProduct(id: string) {
    return prismaClient.product.delete({
        where: {id},
    })
}

export async function getProductById(id: string, groupId: string): Promise<ProductWithRels | null> {
    return prismaClient.product.findFirst({
        where: {id, groupId},
        include: {
            categories: true,
            shoppinglistProducts: true,
            ingredients: true,
            productEntries: {
                orderBy: {purchaseDate: 'desc'},
            },
            userFavouriteProducts: true,
        },
    })
}

export async function getAllProducts(groupId: string): Promise<Product[]> {
    return prismaClient.product.findMany({
        where: {group: {id: groupId}},
        include: {
            categories: true,
            group: true
        },
        orderBy: {name: 'asc'}
        }
    )
}