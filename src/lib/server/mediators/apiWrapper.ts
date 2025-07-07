// import {NextRequest, NextResponse} from 'next/server'
//
// import {validateAuthRequest} from './jwtMediator'
// import {unauthorized, TokenBody} from '../utils'
//
// export type WrapperFnSignature<T = never> = (
//   request: NextRequest,
//   context: {tokenBody?: TokenBody; params: T},
// ) => Promise<NextResponse>
//
// export const apiWrapper =
//   <T = never>(targetFn: WrapperFnSignature<T>, authenticated = true) =>
//   async (request: NextRequest, {params}: {params: Promise<T>}) => {
//     let response: NextResponse
//
//     try {
//       let tokenBody: TokenBody | undefined = undefined
//       if (authenticated) {
//         tokenBody = validateAuthRequest(request)
//       }
//
//       const awaitedParams = typeof params === 'undefined' ? undefined : await params
//       response = await targetFn(request, {tokenBody, params: awaitedParams as T})
//     } catch (ex) {
//       if ((ex as Error).message === 'Unauthorized') {
//         response = unauthorized()
//       } else {
//         throw ex
//       }
//     }
//
//     response.headers.set('Access-Control-Allow-Origin', '*')
//     response.headers.set('content-type', 'application/json')
//
//     if (request.method === 'OPTIONS') {
//       response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
//       response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
//     }
//
//     return response
//   }