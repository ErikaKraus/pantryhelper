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

    await DAL.incrementProductStock(productEntry.productId, productEntry.quantity)

    revalidatePath(`/products/${productEntry.productId}`)
})

export const updateProductEntry = formAction(updateProductEntrySchema, async (productEntry, profile) => {
    const oldProductEntry = await DAL.getProductEntryById(productEntry.id)
    if (!oldProductEntry) {throw new Error('Productregistratie niet gevonden.')}

    await DAL.updateProductEntry({
        id: productEntry.id,
        quantity: productEntry.quantity,
        purchaseDate: productEntry.purchaseDate,
        expiryDate: productEntry.expiryDate,
        })

    const difference = productEntry.quantity - oldProductEntry.quantity
    if (difference !== 0) {
        await DAL.incrementProductStock(productEntry.productId, difference)
    }

    revalidatePath(`/products/${productEntry.productId}`)
})

export const deleteProductEntry = serverFunction(deleteProductEntrySchema, async ({id}, profile) => {
    const {productId, quantity} = await DAL.deleteProductEntry(id)
    await DAL.incrementProductStock(productId, -quantity)
    revalidatePath(`/products/${productId}`)
})

