// import {NextRequest} from 'next/server'
// import {TokenBody, validateJwtToken} from '../utils'
//
// export const validateAuthRequest = (request: NextRequest): TokenBody => {
//   const [_, token] = (request.headers.get('authorization') || ' ').split(' ')
//
//   if (!token) {
//     throw Error('Unauthorized')
//   }
//
//   try {
//     return validateJwtToken(token)
//   } catch (ex) {
//     console.error('Validating JWT token failed', ex)
//     throw Error('Unauthorized')
//   }
// }
