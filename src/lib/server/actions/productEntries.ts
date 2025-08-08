'use server'

import {formAction, serverFunction} from '@mediators'
import {
    createProductEntrySchema,
    deleteProductEntrySchema,
    updateProductEntrySchema,
    updateRemainingQuantitySchema
} from '@schemas'
import DAL from '@dal'
import {revalidatePath} from 'next/cache'

export const createProductEntry = formAction(createProductEntrySchema, async (productEntry, profile) => {
 await DAL.createProductEntry({
    productId: productEntry.productId,
     boughtQuantity: productEntry.boughtQuantity,
     remainingQuantity: productEntry.remainingQuantity,
     purchaseDate: productEntry.purchaseDate,
    expiryDate: productEntry.expiryDate,
    })

    await DAL.recalculateProductStock(productEntry.productId)
    revalidatePath(`/products/${productEntry.productId}`)
})

export const updateProductEntry = formAction(updateProductEntrySchema, async (productEntry, profile) => {
    const oldProductEntry = await DAL.getProductEntryById(productEntry.id)
    if (!oldProductEntry) {throw new Error('Productregistratie niet gevonden.')}

    await DAL.updateProductEntry({
        id: productEntry.id,
        boughtQuantity: productEntry.boughtQuantity,
        remainingQuantity: productEntry.remainingQuantity,
        purchaseDate: productEntry.purchaseDate,
        expiryDate: productEntry.expiryDate,
        })

    await DAL.recalculateProductStock(productEntry.productId)
    revalidatePath(`/products/${productEntry.productId}`)
})

export const deleteProductEntry = serverFunction(deleteProductEntrySchema, async ({id}, profile) => {
    const {productId} = await DAL.deleteProductEntry(id)
    await DAL.recalculateProductStock(productId)
    revalidatePath(`/products/${productId}`)
})

export const updateRemainingQuantity = serverFunction(updateRemainingQuantitySchema, async ({ id, newValue }, profile) => {
    const entry = await DAL.updateProductEntryRemainingQuantity(id, newValue)
    await DAL.recalculateProductStock(entry.productId)
    revalidatePath(`/products/${entry.productId}`)
})
