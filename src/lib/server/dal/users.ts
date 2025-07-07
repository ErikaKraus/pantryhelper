import 'server-only'
import {prismaClient} from './prismaClient'
import {Prisma, Session, User, Role} from '@prisma/client'
import {Profile, profileInclude, profileSelect, SessionWithProfile, sessionWithProfileInclude} from '@models'
import {hashPassword} from '../utils'
import {randomBytes} from 'crypto'
import {cache} from 'react'
import {SessionDuration} from '../../constants'

export type CreateUserParams = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export async function createUser(data: CreateUserParams): Promise<Profile> {
  const group = await prismaClient.group.create({
    data: {
      name: `${data.firstName}'s voorraad`,
      inviteCode: crypto.randomUUID(),
    },
  })
  return prismaClient.user.create({
    data: {
      ...data,
      password: hashPassword(data.password),
      role: Role.USER,
      groupId: group.id,
    },
    include: profileInclude,
  })
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prismaClient.user.findFirst({where: {email}})
}

export async function startSession(params: { id: string; role: Role }): Promise<Session> {
  const id = randomBytes(32).toString('hex')
  return prismaClient.session.create({
    data: {
      id,
      userId: params.id,
      activeFrom: new Date(),
      activeUntil: new Date(Date.now() + SessionDuration[params.role]),
    },
  })
}

export const getSessionProfile = cache((id: string): Promise<SessionWithProfile | null> => {
  return prismaClient.session.findUnique({
    where: {
      id,
      activeUntil: {
        gt: new Date(),
      },
    },
    include: sessionWithProfileInclude,
  })
})

export async function stopSession(id: string): Promise<void> {
  await prismaClient.session.delete({where: {id}})
}

export type UpdateUserParams = Prisma.UserUpdateInput & {id: string}

export async function updateUser({id, ...data}: UpdateUserParams): Promise<Profile> {
  return prismaClient.user.update({
    where: {id},
    data: {
      ...data,
    },
    select: profileSelect,
  })
}

export async function updateUserPassword(params: {id: string; password: string}): Promise<void> {
  const {id, password} = params

  const hashed = hashPassword(password)

  await prismaClient.user.update({
    where: {id},
    data: {
      password: hashed,
    },
    select: profileSelect,
  })
}

/**
 * Extend the given session so that is remains active for another 24 hours.
 *
 * @param id The id of the session to extend.
 * @param duration The amount of milliseconds to extend the session with.
 */
export async function extendSession(id: string, duration: number): Promise<Session> {
  return prismaClient.session.update({
    where: {id},
    data: {
      activeUntil: new Date(Date.now() + duration),
    },
  })
}
