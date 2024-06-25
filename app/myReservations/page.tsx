import EmptyState from '@/app/components/EmptyState'
import getCurrentUser from '@/app/actions/getCurrentUser'
import getReservations from '@/app/actions/getReservations'

import ReservationsClient from './ReservationsClient'
import getReserveNotification from '../actions/getNotifications'

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
  const notifications = await getReserveNotification()

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="No reservations found"
        subtitle="Looks like you have no reservations on your properties."
      />
    )
  }

  return (
    <ReservationsClient // @ts-ignore
      notifications={notifications} // @ts-ignore
      reservations={reservations}
      currentUser={currentUser}
    />
  )
}

export default ReservationsPage
