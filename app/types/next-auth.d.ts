import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      name: string
      role: string
      id: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    id: string
  }
}
