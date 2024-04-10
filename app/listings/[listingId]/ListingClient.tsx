'use client'

import { safeListing, safeReservation, SafeUser } from '@/app/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { categories } from '@/app/components/navbar/Categories'
import Container from '@/app/components/Container'
import ListingHead from '../../components/listings/ListingHead'
import ListingInfo from '@/app/components/listings/ListingInfo'
import useLoginModal from '@/app/hooks/useLoginModal'
import { useRouter } from 'next/navigation'
import {
  differenceInCalendarDays,
  differenceInDays,
  eachDayOfInterval,
} from 'date-fns'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import ListingReservation from '@/app/components/listings/ListingReservation'
import { Range } from 'react-date-range'

// this file is the root of the listing page setup, with listingHead, ListingInfo and Listing Reservation UI

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection',
}

interface ListingClientProps {
  reservations?: safeReservation[]
  listing: safeListing & {
    user: SafeUser
  } // listing should have the properties of safeListing and user (&)
  // if both types is not array but want to combine to call listing.user, then add & to merge the types
  // *see getReservations.ts for full explanation
  currentUser?: SafeUser | null
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
}) => {
  const loginModal = useLoginModal()
  const router = useRouter()

  // calculate disabled dates on the calendar based on the reservations
  const disabledDates = useMemo(() => {
    let dates: Date[] = [] // create an empty array to store the disabled dates

    // iterate all reservations and add them to the dates array
    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      })

      dates = [...dates, ...range]
    })

    return dates
  }, [reservations])

  const [isLoading, setIsLoading] = useState(false)
  const [totalPrice, setTotalPrice] = useState(listing.price)
  const [dateRange, setDateRange] = useState<Range>(initialDateRange) // dateRange state is used to manage the selected date range for a reservation

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      // open loginModal
      toast.error('You must be logged in to create a reservation')
      return loginModal.onOpen()
    }
    setIsLoading(true)
    axios
      .post('/api/reservations', {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing?.id,
      })
      .then(() => {
        setDateRange(initialDateRange)
        router.push('/myTrips')
        toast.success('Listing reserved!', { duration: 5000 })
      })
      .catch((error) => {
        if (error.response?.data?.error) {
          toast.error(error.response.data.error, { duration: 5000 })
        } else {
          toast.error('Something went wrong')
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal])

  // on calendar change, count total price based on days selected
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      )

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price)
      } else {
        setTotalPrice(listing.price)
      }
    }
  }, [dateRange, listing.price])

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category)
  }, [listing.category])

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            id={listing.id}
            currentUser={currentUser}
            region={listing.region}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              address={listing.address}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDateRange={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
                isOwner={listing.userId === currentUser?.id}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ListingClient
