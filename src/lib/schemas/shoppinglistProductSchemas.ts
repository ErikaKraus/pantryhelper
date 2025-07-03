import {z} from 'zod'

export const shoppinglistProductSchema = z.object({
    shoppinglistId: z.string().uuid(),
    productId: z.string().uuid(),
    quantity: z.coerce
        .number({invalid_type_error: 'Hoeveelheid moet een getal zijn'})
        .int('Hoeveelheid moet een geheel getal zijn.')
        .min(1, 'Hoeveelheid moet minstens 1 zijn.'),
    }
)

export const createShoppinglistProductSchema = shoppinglistProductSchema
export const updateShoppinglistProductSchema = shoppinglistProductSchema
export const deleteShoppinglistProductSchema = z.object({
    shoppinglistId: z.string().uuid(),
    productId: z.string().uuid(),
})