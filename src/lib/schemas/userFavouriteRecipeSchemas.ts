import {z} from 'zod'

export const userFavouriteRecipeSchema = z.object({
        id: z.string().uuid(),
        userId: z.string().uuid(),
        recipeId: z.string().uuid(),
    }
)

export const createUserFavouriteRecipeSchema = userFavouriteRecipeSchema.omit({id: true})
export const deleteUserFavouriteRecipeSchema = z.object({
    userId: z.string().uuid(),
    recipeId: z.string().uuid(),
})