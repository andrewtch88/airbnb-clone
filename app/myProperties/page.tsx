// 'use client'

import EmptyState from '../components/EmptyState'

import getCurrentUser from '../actions/getCurrentUser'
import getListings from '../actions/getListings'
import PropertiesClient from './PropertiesClient'

// import { EditListingProvider } from '../contextAPI/EditListingContext'

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

  const listings = await getListings({
    userId: currentUser.id,
    allProperties: true,
  })

  if (listings.length === 0) {
    return (
      <EmptyState
        title="No properties found"
        subtitle="Looks like you have not Airbnb any properties."
      />
    )
  }

  return (
    // <EditListingProvider>
    <PropertiesClient listings={listings} currentUser={currentUser} />
    // </EditListingProvider>
  )
}

export default PropertiesPage
