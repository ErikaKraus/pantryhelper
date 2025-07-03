import {z} from 'zod'
import {UnitRecipe} from '@prisma/client'

export const ingredientSchema = z.object({
    id: z.string().uuid(),
    amount: z.coerce
        .number({invalid_type_error: 'Hoeveelheid moet een getal zijn'})
        .int('Hoeveelheid moet een geheel getal zijn.')
        .positive('Hoeveelheid moet groter zijn dan nul.'),
    unitRecipe: z.nativeEnum(UnitRecipe, {errorMap: ()=> ({message: 'Kies een geldige eenheid.'})}),
    productId: z.string().uuid(),
    recipeId: z.string().uuid(),
    }
)

export const createIngredientSchema = ingredientSchema.omit({id: true})
export const updateIngredientSchema = ingredientSchema
export const deleteIngredientSchema = z.object({id: z.string().uuid()})