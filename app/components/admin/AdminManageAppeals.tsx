import { safeListing } from '@/app/types'
import React from 'react'
import Link from 'next/link'
import ListingCard from '../listings/ListingCard'

interface AdminManageAppealsProps {
  listings: safeListing[]
}

const AdminManageAppeals: React.FC<AdminManageAppealsProps> = ({
  listings,
}) => {
  // const [, setSuspendId] = useState('')

  // const listingItem = (listing: safeListing) => (
  //   <Link href={`/listings/${listing.id}`} passHref>
  //     <ListingCard
  //       key={listing.id}
  //       data={listing}
  //       actionId={listing.id}
  //       onAction={onSuspend}
  //       actionLabel="View listing appeal"
  //       disabled={suspendId === listing.id}
  //     />
  //   </Link>
  // )

  return (
    <section
      aria-labelledby="appeals-items"
      className="border-t border-gray-200 pt-6 lg:pt-6"
    >
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
          xl:grid-cols-5 2xl:grid-cols-6 gap-8"
      ></div>
    </section>
  )
}

export default AdminManageAppeals
