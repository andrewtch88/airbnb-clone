import getCurrentUser from '@/app/actions/getCurrentUser'
import getListingById from '@/app/actions/getListingById'
import getReservations from '@/app/actions/getReservations'
import EmptyState from '@/app/components/EmptyState'
import ListingClient from './ListingClient'

interface IParams {
  listingId?: string // listingId extracted from the folder structure of listings/listingId and the url http://localhost:3000/listings/658af9ab5fd31bbac9eaeb21
}

// cannot use hooks in server component, so use actions to directly communicate with DB
const listingPage = async ({ params }: { params: IParams }) => {
  // params is an object of listingId key and a value of listingId (interface IParams)
  const listing = await getListingById(params)
  const reservations = await getReservations(params)
  const currentUser = await getCurrentUser()

  if (!listing) {
    return <EmptyState />
  }

  return (
    <ListingClient
      listing={listing}
      reservations={reservations}
      currentUser={currentUser}
    />
  )
}

export default listingPage