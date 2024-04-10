import EmptyState from '@/app/components/EmptyState'

import getCurrentUser from '@/app/actions/getCurrentUser'
import getFavoriteListings from '@/app/actions/getFavoriteListings'

import FavouritesClient from './FavouritesClient'

const ListingPage = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="Please login to view your favorited properties"
      />
    )
  }

  const listings = await getFavoriteListings()

  if (listings.length === 0) {
    return (
      <EmptyState
        title="No favorites found"
        subtitle="Looks like you have not favorite any listings."
      />
    )
  }

  return (
    <FavouritesClient favouritedListings={listings} currentUser={currentUser} />
  )
}

export default ListingPage
