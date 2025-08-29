


// // import './globals.css'
// // import type { Metadata } from 'next'
// // import { Providers } from '../providers'
// // import { getServerSession } from 'next-auth'
// // import { authOptions } from './api/auth/[...nextauth]/route'

// // export const metadata: Metadata = {
// //   title: 'Release Note App',
// //   description: 'Submit and review deploy change logs with diffs',
// // }

// // export default async function RootLayout({ children }: { children: React.ReactNode }) {
// //   const session = await getServerSession(authOptions)
// //   const role = session?.user?.role

// //   return (
// //     <html lang="en">
// //       <body className="min-h-screen bg-gray-50 antialiased text-gray-900">
// //         <Providers>
// //           <div className="mx-auto max-w-7xl px-4 py-8">
// //             <header className="mb-8 flex items-center justify-between">
// //               <h1 className="text-2xl font-bold">Release Note</h1>
// //               {role === 'developer' && (
// //                 <nav className="flex gap-3 text-sm">
// //                   <a className="rounded-md px-3 py-2 hover:bg-gray-100" href="/">View</a>
// //                   <a className="rounded-md px-3 py-2 hover:bg-gray-100" href="/submit">Submit</a>
// //                 </nav>
// //               )}
// //             </header>
// //             {children}
// //           </div>
// //         </Providers>
// //       </body>
// //     </html>
// //   )
// // }


// // app/layout.tsx
// import './globals.css'
// import type { Metadata } from 'next'
// import { Providers } from '../providers'
// import { getServerSession } from 'next-auth'
// import { authOptions } from './api/auth/[...nextauth]/route'

// export const metadata: Metadata = {
//   title: 'Release Note App',
//   description: 'Submit and review deploy change logs with diffs',
// }

// export default async function RootLayout({ children }: { children: React.ReactNode }) {
//   const session = await getServerSession(authOptions)
//   const role = session?.user?.role

//   return (
//     <html lang="en">
//       <body className="min-h-screen bg-gray-50 antialiased text-gray-900">
//         <Providers>
//           <div className="mx-auto max-w-7xl px-4 py-8">
//             <header className="mb-8 flex items-center justify-between">
//               <h1 className="text-2xl font-bold">Release Note</h1>

//               {/* Only show menus if role is 'developer' */}
//               {role === 'developer' && (
//                 <nav className="flex gap-3 text-sm">
//                   <a className="rounded-md px-3 py-2 hover:bg-gray-100" href="/">View</a>
//                   <a className="rounded-md px-3 py-2 hover:bg-gray-100" href="/submit">Submit</a>
//                 </nav>
//               )}
//             </header>

//             {children}
//           </div>
//         </Providers>
//       </body>
//     </html>
//   )
// }


// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Providers } from '../providers'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
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
