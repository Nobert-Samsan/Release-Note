import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { username, password, role } = await req.json()

  if (!username || !password || !role) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
  }

  // Check if the username already exists
  const existingUser = await prisma.user.findUnique({
    where: { username },
  })

  if (existingUser) {
    return NextResponse.json({ message: 'Username already exists' }, { status: 409 })
  }

  const hashedPassword = await hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role,
    },
  })

  return NextResponse.json({ message: 'User created', user: newUser })
}
