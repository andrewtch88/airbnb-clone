import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ListingCard from '../listing/ListingCard'
import { useRouter } from 'next/navigation'
import { safeListing } from '@/app/types'
import Paginate from '../Paginate'

interface AdminManagePropertiesProps {
  sortBy?: string
  initialListings: safeListing[]
}

const AdminManageProperties: React.FC<AdminManagePropertiesProps> = ({
  sortBy,
  initialListings,
}) => {
  const [listings, setListings] = useState(initialListings)
  const [suspendId, setSuspendId] = useState('')

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/admin/suspendProperty?sortBy=${sortBy}`
        )
        setListings(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        toast.error('Failed to fetch listings')
      }
    }

    fetchData()
  }, [sortBy])

  const onSuspend = useCallback(
    (id: string) => {
      setSuspendId(id)

      axios
        .put(`/api/admin/suspendProperty/${id}`)
        .then(() => {
          toast.success('Listing Suspended', { duration: 3000 })
          router.refresh()
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error)
        })
        .finally(() => {
          setSuspendId('')
        })
    },
    [router]
  )

  const listingItem = (listing: safeListing) => (
    <ListingCard
      key={listing.id}
      data={listing}
      actionId={listing.id}
      onAction={onSuspend}
      actionLabel="Suspend property"
      disabled={suspendId === listing.id}
    />
  )

  return (
    <section
      aria-labelledby="properties-items"
      className="border-t border-gray-200 pt-6 lg:pt-8"
    >
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
          xl:grid-cols-5 2xl:grid-cols-6 gap-8"
      >
        <Paginate
          items={listings as safeListing[]}
          itemsPerPage={6}
          renderItem={listingItem}
        />
      </div>
    </section>
  )
}

export default AdminManageProperties
