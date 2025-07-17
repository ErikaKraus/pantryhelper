'use server'

import {formAction, serverFunction} from '@mediators'
import {createShoppinglistSchema, deleteShoppinglistSchema, updateShoppinglistSchema} from '@schemas'
import {revalidatePath} from 'next/cache'
import DAL from '@dal'
import {redirect} from 'next/navigation'

export const createShoppingList = formAction(createShoppinglistSchema, async (shoppinglist, profile) => {
    await DAL.createShoppinglist({
        name: shoppinglist.name,
        groupId: profile.groupId,
        })
    revalidatePath('/shoppinglists')
})

export const updateShoppinglist = formAction(updateShoppinglistSchema, async (shoppinglist, profile) => {
await DAL.updateShoppinglist(shoppinglist.id, {
    name: shoppinglist.name,
    })
    revalidatePath('/shoppinglists')
})

export const deleteShoppinglist = serverFunction(deleteShoppinglistSchema, async ({id}, profile) => {
    await DAL.deleteShoppinglist(id)
    revalidatePath('/shoppinglists')
    redirect('/shoppinglists')
})