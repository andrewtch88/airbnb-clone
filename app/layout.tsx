// 'use client'

import type { Metadata } from 'next'
import './globals.css'
import { Nunito } from 'next/font/google'
import Navbar from './components/navbar/Navbar'
import RegisterModal from './components/modals/RegisterModal'
import LoginModal from './components/modals/LoginModal'
import ToasterProvider from './providers/ToasterProvider'
import getCurrentUser from './actions/getCurrentUser'
import RentModal from './components/modals/CreateListingModal'
import getReserveNotification, {
  getInboxNotification,
} from './actions/getNotifications'
import { QueryProvider } from './providers/queryProvider'
import { SocketProvider } from './providers/socketProvider'

// import { EditListingProvider } from './contextAPI/EditListingContext'

// root layout file of the application
export const metadata: Metadata = {
  title: 'Bearbnb',
  description: 'Airbnb clone',
  icons: {
    icon: '/airbnb.ico',
  },
}

const font = Nunito({
  subsets: ['latin'],
})

// Root layout is overall structure of the HTML.
// Providers are used for managing state or logic that needs to be shared across components.
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()
  const notifications = await getReserveNotification()
  const inboxNotifications = await getInboxNotification()

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <RentModal />
        <LoginModal />
        <RegisterModal />
        <Navbar
          currentUser={currentUser}
          // @ts-ignore
          notifications={notifications} // @ts-ignore
          inboxNotifications={inboxNotifications}
        />

        <SocketProvider>
          <QueryProvider>
            {/* children - (Home or other pages) are placed here */}
            <div className="pb-20 pt-28">{children}</div>
          </QueryProvider>
        </SocketProvider>
      </body>
    </html>
  )
}
