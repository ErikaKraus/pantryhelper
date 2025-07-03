import {z} from 'zod'

export const recipeSchemas = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Vul een naam in.'),
    instructions: z.string().optional(),
    groupId: z.string().uuid().optional(),
    ingredientIds: z.array(z.string().uuid()).optional(),
})

export const createRecipeSchema = recipeSchemas.omit({id: true})
export const updateRecipeSchema = recipeSchemas
export const deleteRecipeSchema = z.object({id: z.string().uuid()})