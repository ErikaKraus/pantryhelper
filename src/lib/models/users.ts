import {Prisma} from '@prisma/client'

/**
 * Dit object bepaalt welke velden we willen uitsluiten uit het profiel van een gebruiker.
 * In dit geval willen we het wachtwoord nooit meenemen wanneer we de gebruiker ophalen.
 * Het wordt gebruikt in combinatie met Prisma's `omit`.
 */
export const profileOmit = {
  password: true,
} satisfies Prisma.UserOmit

/**
 * Dit object bepaalt welke verwante modellen we willen includen bij het ophalen van een profiel.
 * We willen in dit geval ook de groep van de gebruiker ophalen.
 * Je kunt dit uitbreiden met meer velden als je die nodig hebt in je UI of logica.
 */
export const profileInclude = {
  group: {
    select: {
      id: true,
      name: true,
      inviteCode: true,
    },
  },
} satisfies Prisma.UserInclude

export const profileSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  groupId: true,
  group: {
    select: {
      id: true,
      name: true,
      inviteCode: true,
    }
  }
} satisfies Prisma.UserSelect

/**
 * Het `Profile` type stelt je in staat om een getypeerd object te krijgen
 * van een gebruiker zoals opgehaald uit de database mét group-informatie,
 * en zonder gevoelige velden zoals `password`.
 */
export type Profile = Prisma.UserGetPayload<{
  select: typeof profileSelect
}>





/**
 * Dit object bepaalt welke relaties je wil includen bij het ophalen van een sessie.
 * We willen hier de user ophalen zónder wachtwoord, maar wél met de `group` (zoals hierboven gedefinieerd).
 */
export const sessionWithProfileInclude = {
  user: {
    include: profileInclude,
  },
} satisfies Prisma.SessionInclude

export const sessionWithProfileSelect = {
  user: {
    select: profileSelect,
  },
} satisfies Prisma.SessionInclude



/**
 * Het `SessionWithProfile` type stelt je in staat om op een veilige manier
 * de actieve sessie mét volledig profiel op te halen.
 * Je gebruikt dit bijv. in `getSessionProfile()` of `getSessionProfileOrRedirect()`.
 */
export type SessionWithProfile = Prisma.SessionGetPayload<{
  include: typeof sessionWithProfileSelect
}>