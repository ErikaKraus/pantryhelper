import * as categories from './categories'
 // import * as recipes from './recipes'
 import * as products from './products'
 import * as shoppinglists from './shoppinglists'
import * as shoppinglistProducts from './shoppinglistProducts'
import * as users from './users'
import * as productEntries from './productEntries'
import * as userFavouriteProducts from './userFavouriteProducts'

/**
 * Om het aantal import statements te beperken en de code overzichtelijk te houden, groeperen we alle acties in dit
 * bestand.
 * We exporteren alle named exports opnieuw zodat we iets als `import {signInOrRegister} from '@actions'`
 * kunnen gebruiken.
 * Let op, hiervoor moet de '@actions' alias wel correct geconfigureerd zijn in tsconfig.json.
 */
export * from './users'
export * from './categories'
 // export * from './recipes'
export * from './products'
 export * from './shoppinglists'
export * from './shoppinglistProducts'
 export * from './products'
export * from './productEntries'
export * from './userFavouriteProducts'

/**
 * We voorzien hier een default export met alle actions in de volledige applicatie.
 * Aangezien we op verschillende plaatsen in de applicatie gebruik maken van functies met dezelfde naam, is het handig
 * als we die functies niet altijd moeten importen met naam, maar wel als een object dat alle functies in één laag
 * groepeert.
 */
const Actions = {
 ...categories,
 // ...recipes,
 ...products,
...shoppinglists,
 ...shoppinglistProducts,
  ...users,
  ...productEntries,
  ...userFavouriteProducts,
}

export default Actions
