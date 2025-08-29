import NextAuth, { AuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma' 


export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[DEBUG] credentials:', credentials)

        if (!credentials?.username || !credentials?.password) {
          console.log('[DEBUG] Missing username or password')
          return null
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        })

        if (!user) {
          console.log('[DEBUG] No user found')
          return null
        }

        const isValid = await compare(credentials.password, user.password)
        console.log('[DEBUG] Password valid:', isValid)

        if (!isValid) {
          console.log('[DEBUG] Password did not match')
          return null
        }

        return {
          id: user.id.toString(),
          name: user.username,
          role: user.role,
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as { id: string; role: string }
        token.role = customUser.role
        token.id = customUser.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }


