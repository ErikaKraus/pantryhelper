import {z} from 'zod'

export const userFavouriteProductSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    productId: z.string().uuid(),
    }
)

export const createUserFavouriteProductSchema = userFavouriteProductSchema.omit({id: true})
export const deleteUserFavouriteProductSchema = z.object({
    userId: z.string().uuid(),
productId: z.string().uuid(),
})