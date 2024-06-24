'use client'

import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useCallback, useState } from 'react'

import { safeReservation, SafeUser } from '@/app/types'

import Heading from '@/app/components/Heading'
import Container from '@/app/components/Container'
import ListingCard from '@/app/components/listing/ListingCard'
import useReviewModal from '../hooks/useReviewModal'
import ReviewModal from '../components/modals/ReviewModal'
import useContactHostModal from '../hooks/useContactModal'
import ContactHostModal from '../components/modals/ContactModal'

interface TripsClientProps {
  reservations: safeReservation[] // reservation includes listings now
  currentUser?: SafeUser | null
}

const TripsClient: React.FC<TripsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const reviewModal = useReviewModal()
  const contactHostModal = useContactHostModal()

  const [
    reservationData,
    setReservationData,
  ] = useState<safeReservation | null>(null)

  const onCancel = useCallback(
    async (id: string) => {
      try {
        const response = await axios.get(`/api/reservations/${id}`)
        setReservationData(response.data)

        contactHostModal.onOpen()
      } catch (error) {
        toast.error('Error fetching reservation details')
      }
    },
    [contactHostModal, setReservationData]
  )

  const onToggleReviewModal = useCallback(
    async (id: string) => {
      try {
        const response = await axios.get(`/api/reservations/${id}`)
        setReservationData(response.data)

        reviewModal.onOpen()
      } catch (error) {
        toast.error('Error fetching reservation details')
      }
    },
    [reviewModal, setReservationData]
  )

  const today = new Date()

  const pastTrips = reservations.filter(
    (reservation) => new Date(reservation.endDate) < today
  )
  const futureTrips = reservations.filter(
    (reservation) => new Date(reservation.endDate) >= today
  )

  return (
    <Container>
      <>
        {futureTrips.length > 0 && (
          <>
            <Heading
              title="Upcoming / Ongoing Trips"
              subtitle="Where you're going"
            />
            <div className="mt-5 mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
              {futureTrips.map((reservation) => (
                <ListingCard
                  key={reservation.id}
                  data={reservation.listing}
                  reservation={reservation}
                  actionId={reservation.id}
                  actionLabel="Message / Cancel"
                  onAction={onCancel}
                  currentUser={currentUser}
                  {...(reservation.hasReviewed === false && {
                    secondaryActionLabel: 'Add review',
                  })}
                  onSecondaryAction={onToggleReviewModal}
                />
              ))}
            </div>
          </>
        )}

        {pastTrips.length > 0 && (
          <div className="border-t border-gray-300 px-4 py-4 sm:px-6">
            <Heading title="Past Trips" subtitle="Where you've been" />
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
              {pastTrips.map((reservation) => (
                <ListingCard
                  key={reservation.id}
                  data={reservation.listing}
                  reservation={reservation}
                  actionId={reservation.id}
                  currentUser={currentUser}
                  onSecondaryAction={onToggleReviewModal}
                  {...(reservation.hasReviewed === false && {
                    secondaryActionLabel: 'Add review',
                  })}
                />
              ))}
            </div>
          </div>
        )}
      </>
      <ReviewModal reservation={reservationData} />
      <ContactHostModal reservation={reservationData} />
    </Container>
  )
}

export default TripsClient
