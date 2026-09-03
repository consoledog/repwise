import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db/prisma'
import { verifyPassword } from '@/lib/auth/password'
import { loginSchema } from '@/features/auth/schemas'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials)

        if (!parsedCredentials.success) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: parsedCredentials.data.email,
          },
        })

        if (!user?.passwordHash) {
          return null
        }

        const passwordMatches = await verifyPassword(
          parsedCredentials.data.password,
          user.passwordHash
        )

        if (!passwordMatches) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id
      }

      return token
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }

      return session
    },
  },
})
