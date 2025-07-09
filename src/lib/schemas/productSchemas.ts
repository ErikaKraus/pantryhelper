import {z} from 'zod'
import {PackagingProduct, UnitProduct} from '@prisma/client'

export const productSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Vul een naam in.'),
    brand: z.string().min(1, 'Vul een merk in.'),
    packagingProduct: z.preprocess(value => (value === '' ? undefined : value), z.nativeEnum(PackagingProduct).optional()),
    volumeContent: z.coerce
        .number({invalid_type_error: 'Inhoud moet een getal zijn'})
        .int('Inhoud moet een geheel getal zijn.')
        .positive('Inhoud moet groter zijn dan nul.')
        .optional(),
    unitProduct: z.preprocess(value => (value === '' ? undefined : value), z.nativeEnum(UnitProduct).optional()),
    numberOfItems: z.coerce
        .number({invalid_type_error: 'Aantal items moet een getal zijn'})
        .int('Aantal items moet een geheel getal zijn.')
        .nonnegative('Aantal items moet groter zijn dan nul.'),
    needsRestock: z.coerce.boolean().optional(),
    isOpen: z.coerce.boolean().optional(),
    categoryIds: z.array(z.string().uuid()).optional(),
    shoppinglistIds: z.array(z.string().uuid()).optional(),
    }
)

export const createProductSchema = productSchema.omit({id: true})
export const updateProductSchema = productSchema
export const deleteProductSchema = z.object({id: z.string().uuid()})