export const dynamic = 'force-dynamic'

import getCurrentUser from '../actions/getCurrentUser'
import getListings, { IListingsParams } from '../actions/getListings'
import Container from '../components/Container'
import EmptyState from '../components/EmptyState'
import ListingCard from '../components/listing/ListingCard'
import { safeListing } from '../types'

interface listingsPageProps {
  searchParams: IListingsParams
}

// automatically get url parameters in a server component (searchParams)
const listingsPage = async ({ searchParams }: listingsPageProps) => {
  const listings = await getListings(searchParams)
  const currentUser = await getCurrentUser()

  if (listings.length === 0) {
    return <EmptyState showReset />
  }
  return (
    <Container>
      <div
        className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
        xl:grid-cols-5 2xl:grid-cols-6 gap-8"
      >
        {listings.map((listing) => {
          return (
            <ListingCard
              key={listing.id}
              data={listing as safeListing}
              currentUser={currentUser}
            />
          )
        })}
      </div>
    </Container>
  )
}

export default listingsPage
