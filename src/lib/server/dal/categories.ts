import 'server-only'
import {Category, Product} from '@prisma/client'
import {prismaClient} from '@/lib/server/dal/prismaClient'

export type CreateCategoryParams = {
    name: string,
    groupId: string,
}

export type UpdateCategoryParams = {
    name: string,
    groupId: string,
}

export async function createCategory(params: CreateCategoryParams): Promise<Category> {
    return prismaClient.category.create({
        data: {
            name: params.name,
            group: {
                connect: {
                    id: params.groupId
                }
            },
        }
    })
}

export async function updateCategory(id: string, params: UpdateCategoryParams): Promise<Category> {
    return prismaClient.category.update({
        where: {id},
        data: {
            name: params.name
        },
    })
}

export async function deleteCategory(id: string): Promise<void> {
    await prismaClient.category.delete({
        where: {id},
    })
}

export async function getCategoryById(id: string, groupId: string): Promise<Category | null> {
    return prismaClient.category.findFirst({
        where: {id, groupId},
    })
}

export async function getAllCategories(groupId: string): Promise<Category[]> {
    return prismaClient.category.findMany({
        where: {groupId},
        orderBy: {name: 'asc'}
    })
}

export async function getProductsByCategory(categoryId: string, groupId: string): Promise<Product[]> {
    return prismaClient.product.findMany({
        where: {groupId, categories: {some: {id: categoryId}}},
        orderBy: {name: 'asc'}
    })
}

export async function getCategoryByName(
    name: string,
    groupId: string
): Promise<Category | null> {
    return prismaClient.category.findFirst({
        where: {
            groupId,
            name: {
                equals: name,
                mode: 'insensitive',
            } },
    })
}
