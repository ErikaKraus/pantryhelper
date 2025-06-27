import {z} from 'zod'
import {Role} from '@prisma/client'

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z
    .string()
    .min(5, {message: 'Het wachtwoord moet minstens 5 tekens bevatten.'})
    .max(100, {message: 'Het wachtwoord mag niet meer dan 100 tekens bevatten.'}),
  role: z.nativeEnum(Role),
  firstName: z.string().min(1, 'Vul je voornaam in.'),
  lastName: z.string().min(1, 'Vul je achternaam in.'),
})

export const signInSchema = userSchema.omit({id: true, role: true, firstName: true, lastName: true})

export const registerSchema = userSchema
  .omit({id: true, role: true})
  // Via extend kunnen we een bestaand schema uitbreiden met extra velden.
  .extend({
    passwordConfirmation: z.string(),
  })
  // De refine methode, die beschikbaar is op properties en het schema zelf, kan gebruikt worden om extra validatie toe
  // te voegen die niet standaard aanwezig is in Zod.
  .refine(data => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Het wachtwoord en de bevestiging komen niet overeen.',
  })

export const updateUserSchema = z
  .object({
    firstName: z.string().min(1, 'Vul je voornaam in.'),
    lastName: z.string().min(1, 'Vul je achternaam in.'),
    email: z.string().email('Ongeldig e-mailadres.'),
    password: z
      .string()
      .min(5, 'Het wachtwoord moet minstens 5 tekens bevatten.')
      .max(100, 'Het wachtwoord mag niet meer dan 100 tekens bevatten.')
      .optional(),
    passwordConfirmation: z.string().optional(),
  })
  .refine(data => !data.password || data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Het wachtwoord en de bevestiging komen niet overeen.',
  })

export const updatePersonalsSchema = z.object({
  firstName: z.string().min(1, 'Vul je voornaam in.'),
  lastName: z.string().min(1, 'Vul je achternaam in.'),
  email: z.string().email('Vul een geldig e-mailadres in.'),
})

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(5, {message: 'Het wachtwoord moet minstens 5 tekens bevatten.'})
      .max(100, {message: 'Het wachtwoord mag niet langer zijn dan 100 tekens.'}),
    passwordConfirmation: z.string(),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Het wachtwoord en de bevestiging komen niet overeen.',
  })
export const updateRoleSchema = userSchema.pick({role: true, id: true})

export const setThemePreferenceSchema = z.object({
  theme: z.union([z.literal('dark'), z.literal('light'), z.literal('system')]),
})
