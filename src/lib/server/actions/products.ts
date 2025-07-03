'use server'

import {formAction, serverFunction} from '@mediators'
import {createProductSchema, deleteProductSchema, updateProductSchema} from '@schemas'
import {revalidatePath} from 'next/cache'
import DAL from '@dal'
import {redirect} from 'next/navigation'

export const createProduct = formAction(createProductSchema, async (product, profile) => {
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
    const { id, categoryIds, ...rest } = product
    await DAL.updateProduct(id, {
        ...rest,                              // unitProduct én packaging én isOpen gaan automatisch mee
        group: { connect: { id: profile.groupId } },
        categories: categoryIds?.length
            ? { connect: categoryIds.map(id => ({ id })) }
            : undefined,
    })
    revalidatePath(`/products/${id}`)

})

export const deleteProduct = serverFunction(deleteProductSchema, async ({id}, profile) => {
    await DAL.deleteProduct(id)
    redirect('/products')
    }
)