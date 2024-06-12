import { getServerSession } from 'next-auth/next'
import NextAuth from '@/pages/api/auth/[...nextauth]'
import prisma from '@/app/libs/prismadb'

type CustomSession = {
  user?: {
    email?: string
    name?: string
    image?: string
  }
}

// NextAuth library that retrieves the user session on the server side
export async function getSession(): Promise<CustomSession | null> {
  return (await getServerSession(NextAuth)) as CustomSession
}

// Retrieves the current user using Prisma and checks if user authenticated then fetch user data from DB
export default async function getCurrentUser() {
  try {
    const session = await getSession()

    if (!session?.user?.email) {
      return null
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    })

    if (!currentUser) {
      return null
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    }
  } catch (error) {
    return null
  }
}
