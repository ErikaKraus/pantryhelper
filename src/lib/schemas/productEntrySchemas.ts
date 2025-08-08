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
    boughtQuantity: z.coerce
        .number({invalid_type_error: 'Hoeveelheid moet een getal zijn'})
        .int('Hoeveelheid moet een geheel getal zijn.')
        .positive('Hoeveelheid moet minstens 1 zijn.'),
    remainingQuantity: z.coerce.number().int().min(0, 'Mag niet onder nul liggen.'),
    productId: z.string().uuid()
    })


export type CreateProductEntryInput = z.infer<typeof createProductEntrySchema>

export const createProductEntrySchema = productEntrySchema.omit({ id: true }).refine(
    (data) => data.remainingQuantity <= data.boughtQuantity,
    {
        message: 'Resterend aantal mag niet groter zijn dan het aangekochte aantal',
        path: ['remainingQuantity'],
    }
)
export const updateProductEntrySchema = productEntrySchema.refine(
    (data) => data.remainingQuantity <= data.boughtQuantity,
    {
        message: 'Resterend aantal mag niet groter zijn dan het aangekochte aantal',
        path: ['remainingQuantity'],
    }
)
export const deleteProductEntrySchema = z.object({id: z.string().uuid(), productId: z.string().uuid()})
export const updateRemainingQuantitySchema = z.object({
    id: z.string().uuid(),
    newValue: z.number().int().min(0)
})