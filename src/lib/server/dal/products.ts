import 'server-only'
import {prismaClient} from '@/lib/server/dal/prismaClient'
import {
    Category,
    Prisma,
    Product,
    ProductEntry,
    ShoppinglistProduct,
    UserFavouriteProduct,
    Ingredient,
    PackagingProduct, UnitProduct
} from '@prisma/client'

export type CreateProductParams = Prisma.ProductCreateInput
export type UpdateProductParams = Prisma.ProductUpdateInput

export type FindDuplicateProductParams = {
    name: string
    brand: string
    packagingProduct?: PackagingProduct | null
    volumeContent?: number | null
    unitProduct?: UnitProduct | null
    groupId: string
}

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

export async function updateProduct(id: string, data: Prisma.ProductUpdateInput) {
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

export async function incrementProductStock(productId: string, amount: number) {
    return prismaClient.product.update({
        where: {id: productId},
        data: {
            numberOfItems: {increment: amount},
        }
    })
}

export async function findDuplicatieProduct(params: FindDuplicateProductParams): Promise<Product | null> {
    const {name, brand, packagingProduct, volumeContent, unitProduct, groupId} = params
    return prismaClient.product.findFirst({
        where: {
            groupId,
            name: {equals: name, mode: 'insensitive'},
            brand: {equals: brand, mode: 'insensitive'},
            packagingProduct,
            volumeContent,
            unitProduct,
            }
        }
    )
}

export async function findDuplicateProductExcludingId(params: FindDuplicateProductParams & { id: string }): Promise<Product | null> {
    const { id, ...rest } = params
    return prismaClient.product.findFirst({
        where: {
            groupId: rest.groupId,
            id: { not: id },
            name: { equals: rest.name, mode: 'insensitive' },
            brand: { equals: rest.brand, mode: 'insensitive' },
            packagingProduct: rest.packagingProduct,
            volumeContent: rest.volumeContent,
            unitProduct: rest.unitProduct,
        },
    })
}

export async function getLowStockProducts(groupId: string): Promise<ProductWithRels[]> {
    return prismaClient.product.findMany({
        where: {
            groupId,
            numberOfItems: { lte: 1 },
        },
        include: {
            categories: true,
            shoppinglistProducts: true,
            ingredients: true,
            productEntries: {
                orderBy: { purchaseDate: 'desc' },
            },
            userFavouriteProducts: true,
        },
        orderBy: { name: 'asc' },
    })
}

