'use client'

import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useCallback, useState, useContext } from 'react'
import { useRouter } from 'next/navigation'

import { safeListing, SafeUser } from '@/app/types'

import Heading from '@/app/components/Heading'
import Container from '@/app/components/Container'
import ListingCard from '@/app/components/listings/ListingCard'
import useEditModal from '@/app/hooks/useEditModal'

// import { useGlobalContext } from '../contextAPI/EditListingContext'
import EditListingModal from '@/app/components/modals/EditListingModal'
import AppealModal from '../components/modals/AppealModal'
import useAppealModal from '../hooks/useAppealModal'

interface PropertiesClientProps {
  listings: safeListing[] // reservation includes listings now
  currentUser?: SafeUser | null
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter()
  const editModal = useEditModal()
  const appealModal = useAppealModal()

  const [deletingId, setDeletingId] = useState('')
  const [listingData, setListingData] = useState<safeListing | null>(null)
  // const { setListing } = useGlobalContext()

  const onToggleEditModal = useCallback(
    async (id: string) => {
      try {
        const response = await axios.get(`/api/listings/${id}`)
        setListingData(response.data)

        editModal.onOpen()
      } catch (error) {
        toast.error('Error fetching listing')
      }
    },
    [editModal, setListingData]
  )

  const onToggleAppealModal = useCallback(
    async (id: string) => {
      try {
        const response = await axios.get(`/api/listings/${id}`)
        setListingData(response.data)

        appealModal.onOpen()
      } catch (error) {
        toast.error('Error fetching listing')
      }
    },
    [editModal, setListingData]
  )

  // id retrieve from key prop, that's why react force to use key prop
  const onDelete = useCallback(
    (id: string) => {
      setDeletingId(id)

      axios
        .delete(`/api/listings/${id}`)
        .then(() => {
          toast.success('Listing deleted')
          router.refresh()
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error)
        })
        .finally(() => {
          setDeletingId('')
        })
    },
    [router]
  )

  return (
    <Container>
      <>
        <Heading
          title="Properties"
          subtitle="List of your gorgeous properties"
        />
        <div
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
          xl:grid-cols-5 2xl:grid-cols-6 gap-8"
        >
          {listings.map((listing: any) => (
            <ListingCard
              key={listing.id}
              data={listing}
              actionId={listing.id}
              // When action (onDelete) is triggered, onDelete is called with actionId as argument.
              // The actionId is used to identify which id should be canceled.
              onAction={onDelete}
              actionLabel={'Delete property'}
              disabled={deletingId === listing.id}
              secondaryActionLabel={
                listing.isSuspended && listing.appeal.status === 'pending'
                  ? undefined
                  : (listing.isSuspended &&
                      listing.appeal.status === 'rejected') ||
                    (listing.isSuspended && !listing.appeal)
                  ? 'Appeal'
                  : 'Edit property'
              }
              onSecondaryAction={
                listing.isSuspended && listing.appeal.status === 'pending'
                  ? undefined
                  : (listing.isSuspended &&
                      listing.appeal.status === 'rejected') ||
                    (listing.isSuspended && !listing.appeal)
                  ? onToggleAppealModal
                  : onToggleEditModal
              }
              currentUser={currentUser}
            />
          ))}
        </div>
        <EditListingModal listing={listingData} />
        <AppealModal listing={listingData} />
      </>
    </Container>
  )
}

export default PropertiesClient
