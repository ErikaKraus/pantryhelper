'use server'

import {formAction, serverFunction} from '@mediators'
import {createProductEntrySchema, deleteProductEntrySchema, updateProductEntrySchema} from '@schemas'
import DAL from '@dal'
import {revalidatePath} from 'next/cache'

export const createProductEntry = formAction(createProductEntrySchema, async (productEntry, profile) => {
await DAL.createProductEntry({
    productId: productEntry.productId,
    quantity: productEntry.quantity,
    purchaseDate: productEntry.purchaseDate,
    expiryDate: productEntry.expiryDate,
    })
    revalidatePath(`/products/${productEntry.productId}`)
})

export const updateProductEntry = formAction(updateProductEntrySchema, async (productEntry, profile) => {
    await DAL.updateProductEntry({
        id: productEntry.id,
        quantity: productEntry.quantity,
        purchaseDate: productEntry.purchaseDate,
        expiryDate: productEntry.expiryDate,
        })
    revalidatePath(`/products/${productEntry.productId}`)
})

export const deleteProductEntry = serverFunction(deleteProductEntrySchema, async ({id, productId}, profile) => {
    await DAL.deleteProductEntry(id)
    revalidatePath(`/products/${productId}`)
})