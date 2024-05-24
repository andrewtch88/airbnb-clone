import { safeListing } from '@/app/types'
import React from 'react'
import Link from 'next/link'
import ListingCard from '../listing/ListingCard'
import Paginate from '../Paginate'
import { useCallback, useState, useContext } from 'react'
import axios from 'axios'
import useAppealModal from '@/app/hooks/useAppealModal'
import toast from 'react-hot-toast'
import AppealModal from '../modals/AppealModal'

interface AdminManageAppealsProps {
  listings: safeListing[]
}

const AdminManageAppeals: React.FC<AdminManageAppealsProps> = ({
  listings,
}) => {
  const [listingData, setListingData] = useState<safeListing | null>(null)

  const appealModal = useAppealModal()

  const onToggleAppealModal = useCallback(
    async (id: string) => {
      try {
        const response = await axios.get(
          `/api/listings/${id}${'?isAdmin=true'}`
        )
        setListingData(response.data)

        appealModal.onOpen()
      } catch (error) {
        toast.error('Error fetching listing')
      }
    },
    [appealModal, setListingData]
  )

  const appealItem = (listing: safeListing) => (
    <ListingCard
      key={listing.id}
      data={listing}
      actionId={listing.id}
      onAction={onToggleAppealModal}
      actionLabel="View suspension appeal"
    />
  )

  return (
    <section
      aria-labelledby="appeals-items"
      className="border-t border-gray-200 pt-6 lg:pt-6"
    >
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
          xl:grid-cols-5 2xl:grid-cols-6 gap-8"
      >
        <Paginate items={listings} itemsPerPage={6} renderItem={appealItem} />
      </div>
      <AppealModal listing={listingData} adminView={true} />
    </section>
  )
}

export default AdminManageAppeals
