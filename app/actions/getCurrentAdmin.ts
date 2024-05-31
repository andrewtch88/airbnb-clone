import { getServerSession } from 'next-auth/next'

import NextAuth from '@/pages/api/auth/[...nextauth]'
import prisma from '@/app/libs/prismadb'

// NextAuth library that retrieves the user session on the server side
export async function getSession() {
  return await getServerSession(NextAuth)
}

// Retrieves the current user using Prisma and checks if user authenticated then fetch user data from DB
export default async function getCurrentAdmin() {
  try {
    const session = await getSession()

    console.log('Session in getCurrentAdmin:', session)

    // should be admin object, remain first
    if (!session?.user?.email) {
      return null
    }

    const currentAdmin = await prisma.admin.findUnique({
      where: {
        // should be admin object, remain first
        email: session.user.email as string,
      },
    })

    if (!currentAdmin) {
      return null
    }

    return {
      ...currentAdmin,
      createdAt: currentAdmin.createdAt.toISOString(),
      updatedAt: currentAdmin.updatedAt.toISOString(),
      emailVerified: currentAdmin.emailVerified?.toISOString() || null,
    }
  } catch (error) {
    return null
  }
}
