import { Prisma, Shoppinglist } from '@prisma/client'
import 'server-only'
import {prismaClient} from '@/lib/server/dal/prismaClient'

export type CreateShoppinglistParams = {
    name: string,
    groupId: string,
}
export type UpdateShoppinglistParams = Prisma.ShoppinglistUpdateInput

export async function createShoppinglist(params:  CreateShoppinglistParams): Promise<Shoppinglist> {
    return prismaClient.shoppinglist.create({
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

export async function updateShoppinglist(id: string, params: UpdateShoppinglistParams): Promise<Shoppinglist> {
    return prismaClient.shoppinglist.update({
        where: {id},
        data: {
            name: params.name,
        }
    })
}

export async function deleteShoppinglist(id: string): Promise<void> {
    await prismaClient.shoppinglist.delete({
        where: {id},
    })
}

export async function getShoppinglistById(id: string, groupId: string): Promise<Shoppinglist | null> {
    return prismaClient.shoppinglist.findFirst({
        where: {id, groupId}
    })
}

export async function getAllShoppinglists(groupId: string): Promise<Shoppinglist[]> {
    return prismaClient.shoppinglist.findMany({
        where: {groupId},
        orderBy: {name: 'asc'}
    })
}