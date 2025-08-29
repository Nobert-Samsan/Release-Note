'use client'

import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function RoleBasedLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const role = session?.user?.role

  const isAuthPage = pathname === '/login' || pathname === '/register'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Release Note</h1>
        {!isAuthPage && session?.user && (
          <div className="flex items-center gap-3 text-sm">
            {role === 'developer' && (
              <>
                <a className="rounded-md px-3 py-2 hover:bg-gray-100" href="/">View</a>
                <a className="rounded-md px-3 py-2 hover:bg-gray-100" href="/submit">Add Entry</a>
              </>
            )}
            {role === 'manager' && (
              <>
                <a className="rounded-md px-3 py-2 hover:bg-gray-100" href="/">View</a>
              </>
            )}
            <button
              onClick={() => signOut()}
              className="rounded-md bg-red-600 text-white px-3 py-2 hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </header>
      {children}
    </div>
  )
}
