import * as convertFormData from './convertFormData'
import * as routeResponses from './routeResponses'
import * as password from './passwordUtils'
import * as cookie from './sessionCookieUtils'
//import * as apiWrapper from './apiWrapper'
//import * as jwtUtils from './jwtUtils'

/**
 * Om het aantal import statements te beperken en de code overzichtelijk te houden, groeperen we alle dallll functies in
 * dit bestand.
 * We exporteren alle named exports opnieuw zodat we iets als `import {signInOrRegister} from '@dallll'`
 * kunnen gebruiken.
 * Let op, hiervoor moet de '@dallll' alias wel correct geconfigureerd zijn in tsconfig.json.
 */

export * from './convertFormData'
export * from './routeResponses'
export * from './passwordUtils'
export * from './sessionCookieUtils'
//export * from './apiWrapper'
//export * from './jwtUtils'

/**
 * We voorzien hier een default export met alle actions in de volledige applicatie.
 * Aangezien we op verschillende plaatsen in de applicatie gebruik maken van functies met dezelfde naam, is het handig
 * als we die functies niet altijd moeten importen met naam, maar wel als een object dat alle functies in één laag
 * groepeert.
 */
const ServerUtils = {
  ...convertFormData,
  ...routeResponses,
  ...password,
  ...cookie,
 // ...apiWrapper,
  // ...jwtUtils,
}

export default ServerUtils
