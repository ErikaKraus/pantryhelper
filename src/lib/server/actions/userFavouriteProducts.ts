'use server'

import {createUserFavouriteProductSchema, deleteUserFavouriteProductSchema} from '@schemas'
import {formAction, serverFunction} from '@mediators'
import DAL from '@dal'
import {revalidatePath} from 'next/cache'
import {z} from 'zod'

export const toggleFavourite = serverFunction(
    z.object({ productId: z.string().uuid() }), async ({productId}, profile) => {
        const existing = await DAL.getUserFavouriteProductById(profile.id, productId)

        if (existing) {
            // Check if favourite product exists already
            await DAL.deleteUserFavouriteProduct(profile.id, productId)
        } else {
            // Create favourite product if non-existent
            await DAL.createUserFavouriteProduct({
                userId: profile.id,
                productId,
            })
        }
        // 3) Revalidate detail productpage so client fetches again
        revalidatePath(`/products/${productId}`)
        revalidatePath('/products')
    }
)

export const deleteUserFavouriteProduct = serverFunction(deleteUserFavouriteProductSchema, async ({productId}, profile) => {
    await DAL.deleteUserFavouriteProduct(profile.id, productId)
    revalidatePath('/products')
})