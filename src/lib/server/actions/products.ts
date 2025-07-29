'use server'

import {formAction, serverFunction} from '@mediators'
import {createProductSchema, deleteProductSchema, updateProductSchema} from '@schemas'
import {revalidatePath} from 'next/cache'
import DAL from '@dal'
import {redirect} from 'next/navigation'
import {PackagingProduct, UnitProduct} from '@prisma/client'
import { z } from 'zod'


export const createProduct = formAction(createProductSchema, async (product, profile) => {
    //Check for duplicates
    const duplicateProduct = await DAL.findDuplicateProduct({
        name: product.name,
        brand: product.brand,
        packagingProduct: product.packagingProduct as PackagingProduct | undefined,
        volumeContent: product.volumeContent ?? null,
        unitProduct: product.unitProduct as UnitProduct | undefined,
        groupId:  profile.groupId,
    })
    if (duplicateProduct) {
        return {
            success: false,
            errors: {
                errors: ['Dit product bestaat al.'],
            },
            submittedData: {
                ...product,
            },
        }
    }

    //Threshold and restock flag
    const threshold    = product.restockThreshold ?? 1
    const restockFlag  = (product.numberOfItems ?? 0) <= threshold

    //Create with DAL, incl threshold and needsRestock
    const { categoryIds, ...rest } = product
    await DAL.createProduct({
        ...rest,                              // hier zit nu o.a. unitProduct, packaging, isOpen, etc.
        restockThreshold: product.restockThreshold,
        needsRestock: restockFlag,
        group: { connect: { id: profile.groupId } },
        categories: categoryIds?.length
            ? { connect: categoryIds.map(id => ({ id })) }
            : undefined,
    })
    revalidatePath('/products')
})

export const updateProduct = formAction(updateProductSchema, async (product, profile) => {
    const {
        id,
        name,
        brand,
        packagingProduct,
        volumeContent,
        unitProduct,
        numberOfItems,
        restockThreshold,
        isOpen,
        categoryIds,
        shoppinglistIds} = product

    //Check for duplicates
    const duplicateProduct = await DAL.findDuplicateProductExcludingId({
        id: product.id,
        name: product.name,
        brand: product.brand,
        packagingProduct: product.packagingProduct as PackagingProduct | undefined,
        volumeContent: product.volumeContent ?? null,
        unitProduct: product.unitProduct as UnitProduct | undefined,
        groupId: profile.groupId,
    })
    if (duplicateProduct) {
        return {
            success: false,
            errors: {
                errors: ['Er bestaat al een gelijk product in jouw voorraad.'],
            },
            submittedData: { ...product },
        }
    }

    //Threshold and restock flag
    const threshold   = restockThreshold ?? 1
    const restockFlag = numberOfItems <= threshold

    //Update with DAL, incl restock threshold and needsrestock
    await DAL.updateProduct(id, {
        name,
        brand,
        packagingProduct,
        volumeContent,
        unitProduct,
        numberOfItems,
        restockThreshold,
        needsRestock: restockFlag,
        isOpen,
        group: { connect: { id: profile.groupId } },
        categories: categoryIds
            ? { set: categoryIds.map((cid) => ({ id: cid })) }
            : undefined,
        // als je shoppinglists meeneemt:
        // shoppinglistProducts: shoppinglistIds
        //     ? { set: shoppinglistIds.map((sid) => ({ shoppinglistId: sid, productId: id })) }
        //     : undefined,
    })
    revalidatePath(`/products/${product.id}`)

})

export const deleteProduct = serverFunction(deleteProductSchema, async ({id}, profile) => {
    await DAL.deleteProduct(id)
    redirect('/products')
    }
)

export const toggleRestock = serverFunction(
    z.object({
        id: z.string().uuid(),
        needsRestock: z.boolean(),
    }),
    async ({ id, needsRestock }, profile) => {
        await DAL.updateProduct(id, { needsRestock })
        revalidatePath('/products/lowstock')
    }
)

