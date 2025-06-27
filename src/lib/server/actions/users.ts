/**
 * Het 'use server' directive wordt gebruikt om aan te geven dat de code in dit bestand enkel server actions bevat.
 * Server actions zijn asynchrone functies die enkel op de server uitgevoerd kunnen worden.
 * Een server action wordt automatisch geconverteerd naar HTTP endpoints door Next.js en kunnen dus aangeroepen worden
 * van op de client.
 *
 * Zodra het 'use server' directive toegevoegd wordt, mag het bestand enkel asynchrone functies exporteren.
 */
'use server'

import {redirect} from 'next/navigation'
import {revalidatePath} from 'next/cache'
import DAL from '@dal'
import {
  clearSessionCookie,
  getSalt,
  getSessionId,
  hashOptions,
  hashPassword,
  setSessionCookie,
  verifyPassword,
} from '@serverUtils'
import {formAction} from '@mediators'
import {registerSchema, signInSchema, updatePasswordSchema, updatePersonalsSchema, updateUserSchema} from '@schemas'
import {ServerFunctionResponse} from '@models'

export const register = formAction(registerSchema, async ({passwordConfirmation, ...newUserInfo}) => {
  const user = await DAL.createUser(newUserInfo)
  const session = await DAL.startSession(user)
  await setSessionCookie(session)

  redirect('/')
})

export const signIn = formAction(signInSchema, async ({email, password}) => {
  const user = await DAL.getUserByEmail(email)

  // Als we meteen een unauthorized terug geven nadat een gebruiker niet gevonden is in de database, kan een aanvaller
  // hieruit afleiden dat het e-mailadres niet bestaat.
  // Vervolgens kan de aanvaller overgaan naar andere email adressen, en moet deze geen tijd meer spenderen aan het adres
  // dat niet bestaat.
  // Als oplossing voegen we een alternatief wachtwoord toe dat gebruikt wordt als de gebruiker niet gevonden is in de
  // database.
  // Omdat we nu in alle gevallen een wachtwoord hashen, is het moeilijker om te bepalen of een e-mailadres bestaat of
  // niet op basis van de response tijd.
  const timingSafePassword = `${hashOptions.iterations}$${hashOptions.keyLength}$preventTimingBasedAttacks123$${getSalt()}`
  const isValidPassword = verifyPassword(user?.password ?? timingSafePassword, password)

  if (!isValidPassword) {
    return {
      success: false,
      errors: {
        errors: ['Er bestaat geen gebruiker voor dit e-mailadres of wachtwoord.'],
      },
    }
  }

  const session = await DAL.startSession(user!)
  await setSessionCookie(session)

  // De gebruiker is ingelogd, dus redirecten we naar de contactenpagina.
  redirect('/')
})

/**
 * Pas de profielgegevens van de ingelogde gebruiker aan.
 */
export const updateProfile = formAction(updateUserSchema, async (data, profile) => {
  // Het is belangrijk dat het id van de gebruiker opgehaald wordt op basis van de sessie (via de backend) en niet
  // zomaar door de client ingevuld kan worden.
  // Als je de formuliergegevens die de client doorstuurt blindelings vertrouwd, kan een kwaadwillige gebruiker data van
  // andere gebruikers aanpassen.
  const payload: Parameters<typeof DAL.updateUser>[0] = {
    id: profile.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    // alleen toevoegen als er een nieuw wachtwoord is
    ...(data.password ? {password: hashPassword(data.password)} : {}),
  }
  await DAL.updateUser(payload)

  // Het profiel wordt gebruikt in de Navbar component, aangezien deze component op de homepagina staat moeten we
  // het root path van de applicatie revalideren.
  revalidatePath('/', 'layout')

  return {success: true}
})

export const updatePersonals = formAction(
  updatePersonalsSchema,
  async (data, profile): Promise<ServerFunctionResponse> => {
    await DAL.updateUser({
      id: profile.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    })
    // Standaard success-response is { success: true }
    return {success: true}
  },
)
export const updatePassword = formAction(
  updatePasswordSchema,
  async (data, profile): Promise<ServerFunctionResponse> => {
    await DAL.updateUserPassword({
      id: profile.id,
      password: data.password,
    })
    return {success: true}
  },
)

/**
 * Log uit en redirect naar de homepagina.
 */
export async function signOut(): Promise<void> {
  // Deze server action heeft geen parameters, dit betekent dat we deze actie niet kunnen aanroepen via een formulier.
  // De action kan echter wel gewoon opgeroepen worden als klik handler op een knop.
  const sessionId = await getSessionId()

  if (sessionId) {
    await DAL.stopSession(sessionId)
    await clearSessionCookie()
  }

  redirect('/login')
}
