//import 'server-only'
import {cookies} from 'next/headers'
import {Session} from '@prisma/client'

const cookieName = 'sessionId'

export async function setSessionCookie(session: Session): Promise<void> {
  const awaitedCookies = await cookies()
  awaitedCookies.set({
    name: cookieName,
    value: session.id,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: session.activeUntil,
  })
}

export async function clearSessionCookie(): Promise<void> {
  const awaitedCookies = await cookies()
  awaitedCookies.delete(cookieName)
}

export async function getSessionId(): Promise<string | undefined> {
  return (await cookies()).get(cookieName)?.value
}
