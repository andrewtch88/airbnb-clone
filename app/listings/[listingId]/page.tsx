// server component cannot use 'use client'

import getCurrentUser from '@/app/actions/getCurrentUser'
import getListingById from '@/app/actions/getListingById'
import getReservations from '@/app/actions/getReservations'
import EmptyState from '@/app/components/EmptyState'
import { safeListing } from '@/app/types'
import ListingClient from './ListingClient'

interface IParams {
  listingId?: string // listingId extracted from the folder structure of listings/listingId and the url http://localhost:3000/listings/658af9ab5fd31bbac9eaeb21
}

// cannot use hooks in server component, so use actions to directly communicate with DB
const listingPage = async ({ params }: { params: IParams }) => {
  const { listingId } = params

  // params is an object of listingId key and a value of listingId (interface IParams)
  const listing = await getListingById({ listingId })
  const reservations = await getReservations({ listingId })
  const currentUser = await getCurrentUser()

  if (!listing) {
    return (
      <EmptyState
        title="Invalid listing"
        subtitle="Kindly input the correct listing ID in the URL"
      />
    )
  }

  return (
    <ListingClient
      // @ts-ignore
      listing={listing} // @ts-ignore
      reservations={reservations}
      currentUser={currentUser}
    />
  )
}

export default listingPage
