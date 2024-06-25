import React, { useState } from 'react'
import Image from 'next/image'
import Button from '../Button'
import { useRouter } from 'next/navigation'
import { safeListing, safeReservation } from '@/app/types'
import useContactHostModal from '@/app/hooks/useContactModal'
import Modal from './Modal'
import Heading from '../Heading'
import toast from 'react-hot-toast'

interface ContactHostModalProps {
  reservation: safeReservation | null
  isHost?: boolean
}

const ContactHostModal: React.FC<ContactHostModalProps> = ({
  reservation,
  isHost,
}) => {
  const router = useRouter()
  const contactHostModal = useContactHostModal()

  const [isLoading, setIsLoading] = useState(false)

  const cancel = () => {
    contactHostModal.onClose()
  }

  const onSubmit = () => {
    setIsLoading(true)

    try {
      if (isHost) {
        router.push(`/myInbox/${reservation?.user?.id}`)
      } else {
        router.push(`/myInbox/${reservation?.listing?.user?.id}`)
      }

      contactHostModal.onClose()

      router.refresh()
    } catch (error) {
      toast.error('Something went wrong', { duration: 5000 })
    } finally {
      setIsLoading(false)
    }
  }

  let bodyContent = (
    <div className="md:col-span-3">
      <Heading
        title={isHost ? 'Tenant contact info' : 'Host contact info'}
        subtitle={
          isHost
            ? 'Contact tenant to confirm booking'
            : 'Contact host for inquiries or to cancel reservation'
        }
      />
      {/* Contact Host */}
      <div className="w-full mb-6 md:mb-0 md:order-first">
        <div className="bg-white border border-gray-200 rounded-lg shadow">
          <div className="flex flex-col items-center pb-10">
            <Image
              className="w-24 h-24 mb-3 rounded-full shadow-lg"
              src={
                isHost
                  ? reservation?.user?.image || '/images/placeholder.jpg'
                  : reservation?.listing?.user?.image ||
                    '/images/placeholder.jpg'
              }
              alt="Host profile pic"
              width={200}
              height={200}
            />
            <h5 className="mb-1 text-xl font-medium text-gray-900">
              {isHost
                ? reservation?.user?.name
                : reservation?.listing?.user?.name}
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {isHost ? 'Tenant' : 'Host'}
            </span>
            <div className="flex mt-4 md:mt-6">
              <Button
                label={isHost ? 'Message Tenant' : 'Message Host'}
                outline
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-black dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                onClick={onSubmit}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  return (
    <Modal
      title={isHost ? 'Contact Tenant' : 'Contact Host'}
      isOpen={contactHostModal.isOpen}
      onClose={contactHostModal.onClose}
      onSubmit={onSubmit}
      actionLabel={isHost ? 'Message Tenant' : 'Message Host'}
      secondaryAction={cancel}
      secondaryActionLabel="Cancel"
      body={bodyContent}
      disabled={isLoading}
    />
  )
}

export default ContactHostModal
