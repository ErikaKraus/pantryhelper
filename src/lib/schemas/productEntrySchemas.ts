import {z} from 'zod'

export const productEntrySchema = z.object({
    id: z.string().uuid(),
    purchaseDate: z.preprocess(
        (val) => (val === '' ? undefined : val),
        z.coerce.date().optional()
    ),
    expiryDate: z.preprocess(
        (val) => (val === '' ? undefined : val),
        z.coerce.date().optional()
    ),
    quantity: z.coerce
        .number({invalid_type_error: 'Hoeveelheid moet een getal zijn'})
        .int('Hoeveelheid moet een geheel getal zijn.')
        .positive('Hoeveelheid moet minstens 1 zijn.'),
    productId: z.string().uuid()
    }
)

export const createProductEntrySchema = productEntrySchema.omit({id: true})
export const updateProductEntrySchema = productEntrySchema
export const deleteProductEntrySchema = z.object({id: z.string().uuid(), productId: z.string().uuid()})