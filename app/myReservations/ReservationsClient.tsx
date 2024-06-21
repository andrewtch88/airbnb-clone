'use client'

import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

import { safeReserveNotification, safeReservation, SafeUser } from '@/app/types'
import Heading from '@/app/components/Heading'
import Container from '@/app/components/Container'
import ListingCard from '@/app/components/listing/ListingCard'

interface ReservationsClientProps {
  reservations: safeReservation[]
  currentUser?: SafeUser | null
  notifications?: safeReserveNotification[]
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
  reservations,
  currentUser,
  notifications,
}) => {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState('')

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id)

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success('Reservation cancelled', { duration: 5000 })
          router.refresh()
        })
        .catch(() => {
          toast.error('Something went wrong.')
        })
        .finally(() => {
          setDeletingId('')
        })
    },
    [router]
  )

  const onMarkRead = useCallback(() => {
    axios
      .put(`/api/notification/`)
      .then(() => {
        toast.success('Marked as read')
        router.refresh()
      })
      .catch(() => {
        toast.error('Something went wrong.')
      })
  }, [router])

  const getStartAndEndOfWeek = (date: Date) => {
    const startOfWeek = new Date(date)
    const endOfWeek = new Date(date)

    // Set startOfWeek to the previous Monday
    const day = date.getDay()
    const diffToMonday = (day === 0 ? -6 : 1) - day
    startOfWeek.setDate(date.getDate() + diffToMonday)

    // Set endOfWeek to the next Sunday
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    // Reset hours to 00:00:00 for startOfWeek and 23:59:59 for endOfWeek
    startOfWeek.setHours(0, 0, 0, 0)
    endOfWeek.setHours(23, 59, 59, 999)

    return { startOfWeek, endOfWeek }
  }

  const today = new Date()

  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(today)

  const thisWeekBookings = reservations.filter(
    (reservation) =>
      (new Date(reservation.startDate) >= startOfWeek &&
        new Date(reservation.startDate) <= endOfWeek) ||
      (new Date(reservation.endDate) >= startOfWeek &&
        new Date(reservation.endDate) <= endOfWeek)
  )

  const futureBookings = reservations.filter(
    (reservation) => new Date(reservation.startDate) > endOfWeek
  )

  const pastBookings = reservations.filter(
    (reservation) => new Date(reservation.endDate) < startOfWeek
  )

  return (
    <Container>
      <div className="pt-10">
        {notifications && notifications[0]?.unreadCount > 0 && (
          <div className="relative">
            <div
              className="absolute top-0 right-0 mr-10 bg-white shadow-md p-2 rounded bg-gray-100 cursor-pointer hover:font-bold hover:text-blue-500"
              onClick={onMarkRead}
            >
              Mark new bookings as read
            </div>
          </div>
        )}

        {thisWeekBookings.length > 0 && (
          <>
            <Heading
              title="This Week's Bookings"
              subtitle="Current Week Bookings on your properties"
            />
            <div className="mt-5 mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
              {thisWeekBookings.map((reservation) => (
                <ListingCard
                  key={reservation.id}
                  data={reservation.listing}
                  reservation={reservation}
                  actionId={reservation.id}
                  // onAction={onCancel}
                  disabled={deletingId === reservation.id}
                  // actionLabel="Cancel guest reservation"
                  currentUser={currentUser}
                  notifications={notifications}
                />
              ))}
            </div>
          </>
        )}

        {futureBookings.length > 0 && (
          <div className="border-t border-gray-300 py-4">
            <Heading
              title="Future Bookings"
              subtitle="Upcoming Bookings on your properties"
            />
            <div className="mt-5 mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
              {futureBookings.map((reservation) => (
                <ListingCard
                  key={reservation.id}
                  data={reservation.listing}
                  reservation={reservation}
                  actionId={reservation.id}
                  // onAction={onCancel}
                  disabled={deletingId === reservation.id}
                  // actionLabel="Cancel guest reservation"
                  currentUser={currentUser}
                  notifications={notifications}
                />
              ))}
            </div>
          </div>
        )}

        {pastBookings.length > 0 && (
          <div className="border-t border-gray-300 px-4 py-4 sm:px-6">
            <Heading
              title="Past Bookings"
              subtitle="Previous Bookings on your properties"
            />
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
              {pastBookings.map((reservation) => (
                <ListingCard
                  key={reservation.id}
                  data={reservation.listing}
                  reservation={reservation}
                  actionId={reservation.id}
                  // onAction={onCancel}
                  disabled={deletingId === reservation.id}
                  // actionLabel="Cancel guest reservation"
                  currentUser={currentUser}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}

export default ReservationsClient
