import './globals.css'
import type { Metadata } from 'next'
import { Providers } from '../providers'
import RoleBasedLayout from './components/RoleBasedLayout'

export const metadata: Metadata = {
  title: 'Release Note App',
  description: 'Submit and review deploy change logs with diffs',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased text-gray-900">
        <Providers>
          <RoleBasedLayout>{children}</RoleBasedLayout>
        </Providers>
      </body>
    </html>
  )
}
