'use client'
import useLoginModal from '@/app/hooks/useLoginModal'
import useRegisterModal from '@/app/hooks/useRegisterModal'
import { useCallback, useEffect, useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai' // hamburger menu icon
import Avatar from '../Avatar'
import MenuItem from './MenuItem'
import { signOut } from 'next-auth/react'
import {
  safeInboxNotification,
  safeReserveNotification,
  SafeUser,
} from '@/app/types'
import useRentModal from '@/app/hooks/useRentModal'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import axios from 'axios'

interface UserMenuProps {
  currentUser?: SafeUser | null
  showComponent?: boolean
  initialNotifications: safeReserveNotification
  initialInboxNotifications?: safeInboxNotification
}

const UserMenu: React.FC<UserMenuProps> = ({
  currentUser,
  showComponent,
  initialInboxNotifications,
  initialNotifications,
}) => {
  const router = useRouter()
  const registerModal = useRegisterModal()
  const loginModal = useLoginModal()
  const rentModal = useRentModal()

  const [notifications, setNotifications] = useState(initialNotifications)
  const [inboxNotifications, setInboxNotifications] = useState(
    initialInboxNotifications
  )
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const pollNotifications = async () => {
      try {
        const response = await axios.get(
          '/api/notification/reserveNotification'
        )
        setNotifications(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    const intervalId = setInterval(pollNotifications, 300000)

    return () => clearInterval(intervalId) // Clean up on unmount
  }, [])

  useEffect(() => {
    const pollNotifications = async () => {
      try {
        const response = await axios.get('/api/notification/inboxNotification')
        setInboxNotifications(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    const intervalId = setInterval(pollNotifications, 1800000)

    return () => clearInterval(intervalId) // Clean up on unmount
  }, [])

  let totalUnreadCount = 0
  const calculateTotalUnreadCount = () => {
    if (notifications && notifications?.unreadCount > 0) {
      totalUnreadCount += notifications?.unreadCount
    }

    if (
      inboxNotifications &&
      inboxNotifications.conversations?.conversationIds.length > 0
    ) {
      totalUnreadCount +=
        inboxNotifications.conversations?.conversationIds.length
    }
  }

  // easier method, onClick={() => setShowAlert(!showAlert)}>, useCallback better performance
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value)
  }, [])

  const toggleRentModal = useCallback(() => {
    if (!currentUser) {
      // rmb to write return to break out of function early
      return loginModal.onOpen()
    }

    rentModal.onOpen()
  }, [currentUser, loginModal, rentModal])

  const handleSignOut = () => {
    signOut()
    toast.success('You have logged out', { duration: 3000 })
    router.refresh()
  }

  const reservationUnreadCount = () => {
    if (notifications && notifications?.unreadCount > 0) {
      return `(${notifications?.unreadCount} new)`
    }
    return ''
  }

  const inboxUnread = () => {
    if (
      inboxNotifications &&
      inboxNotifications.conversations?.conversationIds.length > 0
    ) {
      return `(${inboxNotifications.conversations?.conversationIds.length} new)`
    }
    return ''
  }

  calculateTotalUnreadCount()

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        {showComponent && (
          <>
            <div
              onClick={toggleRentModal}
              className="hidden lg:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
            >
              Bearbnb your home
            </div>
            <div
              onClick={toggleOpen}
              className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
            >
              {isOpen ? 'X' : <AiOutlineMenu />}
              <div className="inline-block">
                <div className="hidden md:block select-none">
                  <Avatar src={currentUser?.image} />
                </div>

                {totalUnreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-6 w-6 bg-red-500 text-white rounded-full text-center leading-6">
                    {totalUnreadCount}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[50vw] min-w-[200px] md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer select-none">
            {currentUser ? (
              <>
                <MenuItem
                  label="My favourites"
                  onClick={() => router.push('/myFavourites')}
                />
                <MenuItem
                  label="My trips"
                  onClick={() => router.push('/myTrips')}
                />
                <MenuItem
                  label={`My inbox ${inboxUnread()}`}
                  onClick={() => router.push('/myInbox')}
                />
                <div className="whitespace-nowrap">
                  <MenuItem
                    label={`My reservations ${reservationUnreadCount()}`}
                    onClick={() => router.push('/myReservations')}
                  />
                </div>
                <MenuItem
                  label="My properties"
                  onClick={() => router.push('/myProperties')}
                />
                <div className="md:hidden">
                  <MenuItem label="Bearbnb my home" onClick={toggleRentModal} />
                </div>
                <hr />
                <MenuItem label="Logout" onClick={handleSignOut} />
              </>
            ) : (
              <>
                <MenuItem label="Login" onClick={loginModal.onOpen} />
                <MenuItem label="Sign up" onClick={registerModal.onOpen} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu
