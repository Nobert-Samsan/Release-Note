import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'



// GET: View all entries (filtered by user role)
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isManager = session.user.role === 'manager'

  const entries = await prisma.entry.findMany({
    where: isManager ? {} : { userId: parseInt(session.user.id) }, // convert ID to number
    include: { files: true, user: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(entries)
}

// POST: Create a new entry with file changes
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'developer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const body = await req.json()
  const { projectName,taskNo, taskName, description, files } = body

  if (!projectName || !taskName || !Array.isArray(files)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const entry = await prisma.entry.create({
    data: {
      projectName,
      taskNo,
      taskName,
      description,
     
      user: { connect: { id: parseInt(session.user.id) } },
      files: {
  create: files.map((f: any) => ({
    filename: f.filename,
    codeBefore: f.codeBefore,
    codeAfter: f.codeAfter,
  })),
}
,
    },
  })

  return NextResponse.json(entry, { status: 201 })
}
