'use server'

import {createUserFavouriteProductSchema, deleteUserFavouriteProductSchema} from '@schemas'
import {formAction, serverFunction} from '@mediators'
import DAL from '@dal'
import {revalidatePath} from 'next/cache'

export const createUserFavouriteProduct = formAction(createUserFavouriteProductSchema, async ({productId}, profile) => {
    await DAL.createUserFavouriteProduct({
        userId: profile.id,
        productId: productId,
        })
    revalidatePath('/products')
})

export const deleteUserFavouriteProduct = serverFunction(deleteUserFavouriteProductSchema, async ({productId}, profile) => {
    await DAL.deleteUserFavouriteProduct(profile.id, productId)
    revalidatePath('/products')
})