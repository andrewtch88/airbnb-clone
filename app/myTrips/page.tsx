import EmptyState from '../components/EmptyState'

import getCurrentUser from '../actions/getCurrentUser'
import TripsClient from './TripsClient'
import getReservations from '../actions/getReservations'

// main page of trips
const TripsPage = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="Please login to view your trips"
      />
    )
  }

  const reservations = await getReservations({ userId: currentUser.id })

  if (reservations.length === 0) {
    return <EmptyState title="No trips found" subtitle="Book one now!" />
  }

  return <TripsClient reservations={reservations} currentUser={currentUser} />
}

export default TripsPage
