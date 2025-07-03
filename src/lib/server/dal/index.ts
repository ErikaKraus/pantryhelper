import * as users from './users'
 import * as products from './products'
 // import * as recipes from './recipes'
import * as shoppinglists from './shoppinglists'
import * as shoppinglistProducts from './shoppinglistProducts'
import * as categories from './categories'
import * as userFavouriteProducts from './userFavouriteProducts'
import * as productEntries from './productEntries'

/**
 * Om het aantal import statements te beperken en de code overzichtelijk te houden, groeperen we alle dallll functies in
 * dit bestand.
 * We exporteren alle named exports opnieuw zodat we iets als `import {signInOrRegister} from '@dallll'`
 * kunnen gebruiken.
 * Let op, hiervoor moet de '@dallll' alias wel correct geconfigureerd zijn in tsconfig.json.
 */
export * from './users'
export * from './products'
// export * from './recipes'
export * from './shoppinglists'
export * from './shoppinglistProducts'
export * from './categories'
export * from './userFavouriteProducts'
export * from './productEntries'

/**
 * We voorzien hier een default export met alle actions in de volledige applicatie.
 * Aangezien we op verschillende plaatsen in de applicatie gebruik maken van functies met dezelfde naam, is het handig
 * als we die functies niet altijd moeten importen met naam, maar wel als een object dat alle functies in één laag
 * groepeert.
 */
const DAL = {
   ...users,
  ...products,
  // ...recipes,
  ...shoppinglists,
  ...shoppinglistProducts,
  ...categories,
  ...userFavouriteProducts,
  ...productEntries,
}

export default DAL
