// import * as categories from './categories'
// import * as dishes from './dishes'
// import * as products from './products'
// import * as shoppinglists from './shoppinglists'
// import * as shoppinglistProducts from './shoppinglistProducts'
import * as users from './users'

/**
 * Om het aantal import statements te beperken en de code overzichtelijk te houden, groeperen we alle acties in dit
 * bestand.
 * We exporteren alle named exports opnieuw zodat we iets als `import {signInOrRegister} from '@actions'`
 * kunnen gebruiken.
 * Let op, hiervoor moet de '@actions' alias wel correct geconfigureerd zijn in tsconfig.json.
 */
export * from './users'
// export * from './categories'
// export * from './dishes'
// export * from './products'
// export * from './shoppinglists'
// export * from './shoppinglistProducts'
// export * from './products'

/**
 * We voorzien hier een default export met alle actions in de volledige applicatie.
 * Aangezien we op verschillende plaatsen in de applicatie gebruik maken van functies met dezelfde naam, is het handig
 * als we die functies niet altijd moeten importen met naam, maar wel als een object dat alle functies in één laag
 * groepeert.
 */
const Actions = {
  // ...categories,
  // ...dishes,
  // ...products,
  // ...shoppinglists,
  // ...shoppinglistProducts,
  ...users,
}

export default Actions
