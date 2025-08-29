
import { prisma } from '@/lib/prisma'
import EntriesTable from './components/EntriesTable'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'



export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/login')
    return null 
  }

  const isManager = session.user.role === 'manager'

  const entries = await prisma.entry.findMany({
    where: isManager ? {} : { userId: parseInt(session.user.id) },
    include: { files: true, user: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">ChangeLog Entries</h2>
      <EntriesTable entries={entries} role={session.user.role!} />
    </div>
  )
}
