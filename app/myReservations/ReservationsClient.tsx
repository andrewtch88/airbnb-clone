'use client'

import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

import { safeReservation, SafeUser } from '@/app/types'
import Heading from '@/app/components/Heading'
import Container from '@/app/components/Container'
import ListingCard from '@/app/components/listing/ListingCard'

interface ReservationsClientProps {
  reservations: safeReservation[]
  currentUser?: SafeUser | null
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
  reservations,
  currentUser,
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

  const getStartAndEndOfWeek = (date: Date) => {
    const startOfWeek = new Date(date)
    const endOfWeek = new Date(date)

    // Set startOfWeek to the previous Sunday
    startOfWeek.setDate(date.getDate() - date.getDay())

    // Set endOfWeek to the next Saturday
    endOfWeek.setDate(date.getDate() + (6 - date.getDay()))

    // Reset hours to 00:00:00 for comparison
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

  const pastBookings = reservations.filter(
    (reservation) => new Date(reservation.endDate) < startOfWeek
  )

  return (
    <Container>
      {thisWeekBookings.length > 0 && (
        <>
          <Heading
            title="This Week's Ongoing Bookings"
            subtitle="Latest Bookings on your properties"
          />
          <div className="mt-5 mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
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
              />
            ))}
          </div>
        </>
      )}

      {pastBookings.length > 0 && (
        <div className="border-t">
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
    </Container>
  )
}

export default ReservationsClient
