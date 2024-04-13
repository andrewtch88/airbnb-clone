'use client'

import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

import { safeListing, SafeUser } from '@/app/types'

import Heading from '@/app/components/Heading'
import Container from '@/app/components/Container'
import ListingCard from '@/app/components/listings/ListingCard'
import useEditModal from '@/app/hooks/useEditModal'

import getListingById from '@/app/actions/getListingById'

// trips listings card page
interface PropertiesClientProps {
  listings: safeListing[] // reservation includes listings now
  currentUser?: SafeUser | null
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState('')
  const [editId, setEditId] = useState('')
  const editModal = useEditModal()

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

  const onToggleEditModal = useCallback(
    async (id: string) => {
      try {
        const listing = await getListingById(id)
        setEditId(id)

        editModal.onOpen()
      } catch (error) {
        toast.error((error as Error).message)
      } finally {
        setEditId('')
      }
    },
    [editModal]
  )

  return (
    <Container>
      <Heading title="Properties" subtitle="List of your gorgeous properties" />
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
            // The actionId is used to identify which reservation should be canceled.
            onAction={onDelete}
            actionLabel="Delete property"
            disabled={deletingId === listing.id}
            secondaryActionLabel="Edit property"
            onSecondaryAction={onToggleEditModal}
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  )
}

export default PropertiesClient
