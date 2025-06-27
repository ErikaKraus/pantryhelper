import {Role} from '@prisma/client'

export const SessionDuration = {
  [Role.USER]: 1000 * 60 * 60 * 24,
  [Role.ADMIN]: 1000 * 60 * 60 * 12,
} satisfies Record<Role, number>
