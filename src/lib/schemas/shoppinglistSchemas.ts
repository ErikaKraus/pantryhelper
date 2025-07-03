import {z} from 'zod'

export const shoppinglistSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Vul een naam in.'),
    groupId: z.string().uuid().optional(),
    productIds: z.array(z.string().uuid()).optional(),
    }
)

export const createShoppinglistSchema = shoppinglistSchema.omit({id: true})
export const updateShoppinglistSchema = shoppinglistSchema
export const deleteShoppinglistSchema = z.object({id: z.string().uuid()})