'use client'

import {
  safeInboxNotification,
  safeReserveNotification,
  SafeUser,
} from '@/app/types'
import Container from '../Container'
import Categories from './Categories'
import Logo from './Logo'
import Search from './Search'
import UserMenu from './UserMenu'
import { usePathname } from 'next/navigation'

interface NavbarProps {
  currentUser?: SafeUser | null
  notifications?: safeReserveNotification
  inboxNotifications?: safeInboxNotification
}

const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  notifications,
  inboxNotifications,
}) => {
  const pathname = usePathname()
  const showComponent = pathname !== '/adminDashboard'
  const showSearch = pathname !== '/adminDashboard' && pathname !== '/'

  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo showComponent={showComponent} />
            {showSearch && (
              <div className="flex-grow text-center">
                <Search />
              </div>
            )}
            <div className="ml-auto">
              <UserMenu
                currentUser={currentUser}
                showComponent={showComponent}
                initialNotifications={notifications as safeReserveNotification}
                initialInboxNotifications={inboxNotifications}
              />
            </div>
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  )
}

export default Navbar
