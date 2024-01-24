import EmptyState from '@/app/components/EmptyState'
import getCurrentUser from '@/app/actions/getCurrentUser'
import getReservations from '@/app/actions/getReservations'

import ReservationsClient from './ReservationsClient'

const ReservationsPage = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="Please login to view your reservations"
      />
    )
  }

  const reservations = await getReservations({ ownerId: currentUser.id })

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="No reservations found"
        subtitle="Looks like you have no reservations on your properties."
      />
    )
  }

  return (
    <ReservationsClient reservations={reservations} currentUser={currentUser} />
  )
}

export default ReservationsPage
