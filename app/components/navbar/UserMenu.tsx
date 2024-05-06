'use client'
import useLoginModal from '@/app/hooks/useLoginModal'
import useRegisterModal from '@/app/hooks/useRegisterModal'
import { useCallback, useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai' // hamburger menu icon
import Avatar from '../Avatar'
import MenuItem from './MenuItem'
import { signOut } from 'next-auth/react'
import { SafeUser } from '@/app/types'
import useRentModal from '@/app/hooks/useRentModal'
import { useRouter } from 'next/navigation'
import Button from '../Button'
import toast from 'react-hot-toast'

interface UserMenuProps {
  currentUser?: SafeUser | null
  showComponent?: boolean
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser, showComponent }) => {
  const router = useRouter()
  const registerModal = useRegisterModal()
  const loginModal = useLoginModal()
  const rentModal = useRentModal()

  const [isOpen, setIsOpen] = useState(false)

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

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        {showComponent && (
          <>
            <div
              onClick={toggleRentModal}
              className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
            >
              Bearbnb your home
            </div>
            <div
              onClick={toggleOpen}
              className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
            >
              <AiOutlineMenu />
              <div className="hidden md:block select-none">
                <Avatar src={currentUser?.image} />
              </div>
            </div>
          </>
        )}
      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer select-none">
            {currentUser ? (
              <>
                <MenuItem
                  label="My trips"
                  onClick={() => router.push('/myTrips')}
                />
                <MenuItem
                  label="My favourites"
                  onClick={() => router.push('/myFavourites')}
                />
                <MenuItem
                  label="My reservations"
                  onClick={() => router.push('/myReservations')}
                />
                <MenuItem
                  label="My properties"
                  onClick={() => router.push('/myProperties')}
                />
                <MenuItem label="Bearbnb my home" onClick={toggleRentModal} />
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
