import { PrismaClient } from '@prisma/client'

declare global {
  var _prisma: PrismaClient | undefined
}

const client = globalThis._prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') {
  globalThis._prisma = client
}

export default client
