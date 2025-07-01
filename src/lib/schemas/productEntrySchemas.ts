import {z} from 'zod'
import {UnitProduct} from '@prisma/client'

export const productEntrySchema = z.object({
    id: z.string().uuid(),
    purchaseDate: z.coerce.date().optional(),
    expiryDate: z.coerce.date().optional(),
    quantity: z.coerce
        .number({invalid_type_error: 'Hoeveelheid moet een getal zijn'})
        .int('Hoeveelheid moet een geheel getal zijn.')
        .positive('Hoeveelheid moet minstens 1 zijn.'),
    unitProduct: z.nativeEnum(UnitProduct).optional(),
    productId: z.string().uuid()
    }
)

export const createProductEntrySchema = productEntrySchema.omit({id: true})
export const updateProductEntrySchema = productEntrySchema
export const deleteProductEntrySchema = z.object({id: z.string().uuid()})