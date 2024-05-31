import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import CredentialsProvider from 'next-auth/providers/credentials'

const prisma = new PrismaClient()

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const isAdmin = credentials.email === 'admin@gmail.com'

        const userOrAdmin = await prisma[isAdmin ? 'admin' : 'user'].findUnique(
          {
            where: { email: credentials.email },
          }
        )

        if (!userOrAdmin || !userOrAdmin.hashedPassword) {
          throw new Error(
            `${isAdmin ? 'Admin' : 'User'} does not exist, please try again`
          )
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          userOrAdmin.hashedPassword
        )

        if (!isPasswordValid) {
          throw new Error(
            `Wrong ${isAdmin ? 'admin' : 'user'} password, please try again`
          )
        }

        return { ...userOrAdmin, role: isAdmin ? 'admin' : 'user' }
      },
    }),
  ],
  // pages: {
  //   signIn: '/', // if any errors then redirect to main page
  // },

  debug: process.env.NODE_ENV === 'development',

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
})
