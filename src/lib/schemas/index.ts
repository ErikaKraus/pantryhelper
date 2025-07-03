import * as categorySchemas from './categorySchemas'
import * as ingredientSchemas from './ingredientSchemas'
import * as productEntrySchemas from './productEntrySchemas'
import * as productSchemas from './productSchemas'
import * as recipeSchemas from './recipeSchemas'
import * as shoppingListProductSchemas from './shoppinglistProductSchemas'
import * as shoppingListSchemas from './shoppinglistSchemas'
import * as userFavouriteProductSchemas from './userFavouriteProductSchemas'
import * as userFavouriteRecipeSchemas from './userFavouriteRecipeSchemas'
import * as userSchemas from './userSchemas'

export * from './categorySchemas'
export * from './ingredientSchemas'
export * from './productEntrySchemas'
export * from './productSchemas'
export * from './recipeSchemas'
export * from './shoppinglistProductSchemas'
export * from './shoppinglistSchemas'
export * from './userFavouriteProductSchemas'
export * from './userFavouriteRecipeSchemas'
export * from './userSchemas'

const Schemas = {
    ...categorySchemas,
    ...ingredientSchemas,
    ...productEntrySchemas,
    ...productSchemas,
    ...recipeSchemas,
    ...shoppingListProductSchemas,
    ...shoppingListSchemas,
    ...userFavouriteProductSchemas,
    ...userFavouriteRecipeSchemas,
    ...userSchemas,
}

export default Schemas