'use server'

import {formAction, serverFunction} from '@mediators'
import {createProductSchema, deleteProductSchema, updateProductSchema} from '@schemas'
import {revalidatePath} from 'next/cache'
import DAL from '@dal'
import {redirect} from 'next/navigation'
import {PackagingProduct, UnitProduct} from '@prisma/client'

export const createProduct = formAction(createProductSchema, async (product, profile) => {
    const duplicateProduct = await DAL.findDuplicatieProduct({
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

    const { categoryIds, ...rest } = product
    await DAL.createProduct({
        ...rest,                              // hier zit nu o.a. unitProduct, packaging, isOpen, etc.
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
        needsRestock,
        isOpen,
        categoryIds,
        shoppinglistIds} = product

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
    // const { id, categoryIds, ...rest } = product
    await DAL.updateProduct(id, {
        name,
        brand,
        packagingProduct,
        volumeContent,
        unitProduct,
        numberOfItems,
        needsRestock,
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