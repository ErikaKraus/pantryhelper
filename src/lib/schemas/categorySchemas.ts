import {z} from 'zod'

export const categorySchema = z.object({
    id: z.string().uuid(),
    name: z.string({required_error: 'Geef de categorie een naam.'}).min(1, 'Geef de categorie een naam.'),
})

export const createCategorySchema = categorySchema.omit({id: true})
export const updateCategorySchema = categorySchema
export const deleteCategorySchema = z.object({id: z.string().uuid()})