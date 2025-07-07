'use server'

import DAL from '@dal'
import {formAction, serverFunction} from '@mediators'
import {createCategorySchema, deleteCategorySchema, updateCategorySchema} from '@schemas'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'


export const createCategory = formAction(createCategorySchema, async (category, profile) => {
    const existingCategory = await DAL.getCategoryByName(category.name, profile.groupId)
    if (existingCategory) {
        return {
            success: false,
            errors: {
                errors: ['Deze categorie bestaat al.'],
            },
            submittedData: {name: category.name, groupId: profile.groupId},
        }
    }
    await DAL.createCategory({
        name: category.name,
        groupId: profile.groupId,
        })
    revalidatePath('/categories')
    redirect('/categories')
})

export const updateCategory = formAction(updateCategorySchema, async (category, profile) => {
    const existingCategory = await DAL.getCategoryByName(category.name, profile.groupId)
    if (existingCategory && existingCategory.id !== category.id) {
        return {
            success: false,
            errors: {
                errors: ['Deze categorie bestaat al.'],
            },
            submittedData: {name: category.name, groupId: profile.groupId},
        }
    }
    await DAL.updateCategory(category.id, {
        name: category.name,
        groupId: profile.groupId,
        })
    revalidatePath('/categories')
})

export const deleteCategory = serverFunction(deleteCategorySchema, async ({id}, profile) => {
    await DAL.deleteCategory(id)
    redirect('/categories')
})