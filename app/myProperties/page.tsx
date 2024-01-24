import EmptyState from '../components/EmptyState'

import getCurrentUser from '../actions/getCurrentUser'
import getListings from '../actions/getListings'
import PropertiesClient from './PropertiesClient'

// main page of trips
const PropertiesPage = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="Please login to view your properties"
      />
    )
  }

  const listings = await getListings({ userId: currentUser.id })

  if (listings.length === 0) {
    return (
      <EmptyState
        title="No properties found"
        subtitle="Looks like you have not Airbnb any properties."
      />
    )
  }

  return <PropertiesClient listings={listings} currentUser={currentUser} />
}

export default PropertiesPage
