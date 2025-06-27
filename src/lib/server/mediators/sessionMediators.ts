import 'server-only'
import {redirect} from 'next/navigation'
import {Profile, SessionWithProfile} from '@models'
import {getSessionId, setSessionCookie} from '@serverUtils'
import DAL from '@dal'
import {Role} from '@prisma/client'
import {SessionDuration} from '@/lib/constants'

export async function getSession(): Promise<SessionWithProfile | null> {
  const sessionId = await getSessionId()
  return sessionId ? await DAL.getSessionProfile(sessionId) : null
}

export async function getSessionProfile(): Promise<Profile | null> {
  const session = await getSession()
  return session?.user ?? null
}

export async function getSessionProfileOrRedirect(url: string = '/login'): Promise<Profile> {
  const sessionProfile = await getSessionProfile()

  if (!sessionProfile) {
    return redirect(url)
  }

  return sessionProfile
}

/**
 * Try retrieving the profile of a user who is authorised, i.e. has the given role.
 *
 * @param role The role the user must have to be considered authorised.
 * @param url The URL to redirect to if the user is not authorised, defaults to '/login'.
 */
export async function getAuthorisedProfileOrRedirect(role: Role, url: string = '/login'): Promise<Profile> {
  // Omdat de redirect functie intern een foutmelding opgooit mag je er van uit gaan dat deze lijn nooit gepasseerd
  // wordt, tenzij de gebruiker daadwerkelijk ingelogd is.
  const sessionProfile = await getSessionProfileOrRedirect()

  if (sessionProfile.role !== role) {
    return redirect(url)
  }

  return sessionProfile
}

export async function getSessionProfileAndOptionallyExtend(): Promise<Profile> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  if (session.activeUntil.getTime() - Date.now() < SessionDuration[session.user.role] / 2) {
    await extendSession(session.id, session.user.role)
  }

  return session.user
}

export async function getAuthorisedSessionProfileAndOptionallyExtend(role: Role): Promise<Profile> {
  const sessionProfile = await getSessionProfileAndOptionallyExtend()

  if (sessionProfile.role !== role) {
    throw new Error('Unauthorized')
  }

  return sessionProfile
}

export async function extendSession(id: string, role: Role): Promise<void> {
  const extendedSession = await DAL.extendSession(id, SessionDuration[role])
  await setSessionCookie(extendedSession)
}
