'use server'

import {formAction, serverFunction} from '@mediators'
import DAL from '@dal'
import {
    createShoppinglistProductSchema,
    deleteShoppinglistProductSchema,
    updateShoppinglistProductSchema
} from '@schemas'
import {revalidatePath} from 'next/cache'

export const createShoppinglistProduct = formAction(createShoppinglistProductSchema, async (shoppinglistProduct, profile) => {
    await DAL.createShoppinglistProduct({
        shoppinglistId: shoppinglistProduct.shoppinglistId,
        productId: shoppinglistProduct.productId,
        quantity: shoppinglistProduct.quantity,
    })
    revalidatePath(`/shoppinglists/${shoppinglistProduct.shoppinglistId}`)
})

export const updateShoppinglistProduct = formAction(updateShoppinglistProductSchema, async (shoppinglistProduct, profile) => {
    await DAL.updateShoppinglistProduct({
        shoppinglistId: shoppinglistProduct.shoppinglistId,
        productId: shoppinglistProduct.productId,
        quantity: shoppinglistProduct.quantity,
        }
    )
    revalidatePath(`/shoppinglists/${shoppinglistProduct.shoppinglistId}`)
})

export const deleteShoppinglistProduct = serverFunction(deleteShoppinglistProductSchema, async ({shoppinglistId, productId}, profile) => {
    await DAL.deleteShoppinglistProduct({shoppinglistId, productId})
    revalidatePath(`/shoppinglists/${shoppinglistId}`)
})