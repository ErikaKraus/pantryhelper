'use server'

import {formAction, serverFunction} from '@mediators'
import {createProductSchema} from '@schemas'
import {ServerFunctionResponse} from '@models'
import {revalidatePath} from 'next/cache'
import DAL from '@dal'

export const createProduct = formAction(createProductSchema, async (product, profile) => {
    await DAL.createProduct({
        ...product,
        group: {
            connect: {id: profile.groupId}
        },
        categories: product.categoryIds?.length
        ? {connect: product.categoryIds.map(id => ({id}))}
            : undefined,
    })
    revalidatePath('/products')
})

