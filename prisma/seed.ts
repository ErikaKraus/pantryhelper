import {seedDev} from './seedDev'
import {seedProd} from './seedProd'
import {PrismaClient} from '@prisma/client'
import {env} from 'process'

const runtimeEnv = env.NODE_ENV ?? 'development'
const client = new PrismaClient()

const seedFunction = runtimeEnv === 'development' ? seedDev : seedProd

seedFunction(client)
    .then(async () => {
        await client.$disconnect()
        console.log('Successfully seeded')
    })
    .catch(async (error) => {
        console.error(error)
        await client.$disconnect()
        process.exit(1)
    })
