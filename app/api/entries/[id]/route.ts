import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// GET: Fetch a single entry by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const entryId = Number(id)

  try {
    const entry = await prisma.entry.findUnique({
      where: { id: entryId },
      include: { files: true },
    })

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    // Check if the user has access
    if (session.user.role === 'developer' && entry.userId !== Number(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Error fetching entry:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE: Remove an entry by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const entryId = Number(id)

  if (isNaN(entryId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    await prisma.fileChange.deleteMany({ where: { entryId } })
    await prisma.entry.delete({ where: { id: entryId } })

    return NextResponse.json({ message: 'Entry deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting entry:', error)
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}

// PUT: Update an entry
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const entryId = Number(id)

  if (isNaN(entryId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    const body = await req.json()

    // Handle manager deployment date update
    if (session.user.role === 'manager' && body.deployedAt) {
      const updated = await prisma.entry.update({
        where: { id: entryId },
        data: { deployedAt: new Date(body.deployedAt) },
        include: { files: true, user: true },
      })
      return NextResponse.json(updated)
    }

    // Handle developer full entry update
    const { projectName, taskNo, taskName, description, files } = body

    if (!projectName || !taskName || !files || files.length === 0) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Check permission
    const entry = await prisma.entry.findUnique({ where: { id: entryId } })
    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }
    if (session.user.role === 'developer' && entry.userId !== Number(session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Clear old file changes
    await prisma.fileChange.deleteMany({ where: { entryId } })

    // Update with new data
    const updated = await prisma.entry.update({
      where: { id: entryId },
      data: {
        projectName,
        taskNo,
        taskName,
        description,
        files: {
          create: files.map((file: any) => ({
            filename: file.filename,
            codeBefore: file.codeBefore,
            codeAfter: file.codeAfter,
          })),
        },
      },
      include: { files: true, user: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating entry:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
