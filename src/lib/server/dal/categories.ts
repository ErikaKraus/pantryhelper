import 'server-only'
import {Category, Prisma } from '@prisma/client'
import {prismaClient} from '@/lib/server/dal/prismaClient'

export type CreateCategoryParams = Prisma.CategoryUncheckedCreateInput

export async function createCategory(params: CreateCategoryParams): Promise<Category> {
    return prismaClient.category.create({
        data: {
            name: params.name,
            groupId: params.groupId,
        },
    })
}

export async function updateCategory(id: string, params: CreateCategoryParams): Promise<Category> {
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
