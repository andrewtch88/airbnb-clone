'use client'

import { safeListing, safeReservation, SafeUser } from '@/app/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { categories } from '@/app/components/navbar/Categories'
import Container from '@/app/components/Container'
import ListingHead from '../../components/listings/ListingHead'
import ListingInfo from '@/app/components/listings/ListingInfo'
import useLoginModal from '@/app/hooks/useLoginModal'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  differenceInCalendarDays,
  differenceInDays,
  eachDayOfInterval,
  isAfter,
  isSameDay,
  addDays,
} from 'date-fns'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import ListingReservation from '@/app/components/listings/ListingReservation'
import { Range } from 'react-date-range'
import dynamic from 'next/dynamic'
import ListingReview from '@/app/components/listings/ListingReview'

// this file is the root of the listing page setup, with listingHead, ListingInfo and Listing Reservation UI

interface ListingClientProps {
  reservations?: safeReservation[]
  listing: safeListing
  currentUser?: SafeUser | null
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [totalPrice, setTotalPrice] = useState(listing.price)

  const loginModal = useLoginModal()
  const router = useRouter()
  const params = useSearchParams()
  const success = params?.get('success')

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

  const getInitialDateRange = (disabledDates: Date[]) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to midnight for consistency

    let nextAvailableDate = today

    const findNextAvailableDate = (date: Date) => {
      while (
        disabledDates.some((disabledDate) => isSameDay(disabledDate, date))
      ) {
        date = addDays(date, 1)
      }
      return date
    }

    nextAvailableDate = findNextAvailableDate(nextAvailableDate)

    return {
      startDate: nextAvailableDate,
      endDate: nextAvailableDate,
      key: 'selection',
    }
  }

  const initialDateRange = getInitialDateRange(disabledDates)
  const [dateRange, setDateRange] = useState<Range>(initialDateRange) // dateRange state is used to manage the selected date range for a reservation

  const onCheckout = useCallback(async () => {
    try {
      if (!currentUser) {
        toast.error('You must be logged in to create a reservation')
        return loginModal.onOpen()
      }

      setIsLoading(true)
      const response = await axios.post('/api/checkout', {
        perNightPrice: listing?.price,
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing?.id,
      })

      window.location.assign(response.data.url)
    } catch (error) {
      toast.error('Something went wrong')
      setIsLoading(false)
    }
  }, [totalPrice, dateRange, listing?.id, currentUser, loginModal])

  useEffect(() => {
    let isSuccessHandled = false

    const handleSuccessfulCheckout = () => {
      if (success === 'true' && !isSuccessHandled) {
        isSuccessHandled = true

        setDateRange(initialDateRange)

        router.push('/myTrips')
        toast.success('Listing reserved!', { duration: 5000 })
      } else if (success === 'false') {
        toast.error('Checkout cancelled or failed.')
      }
    }

    handleSuccessfulCheckout()

    return () => setIsLoading(false)
  }, [success, setDateRange, router])

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
        setTotalPrice(0)
      }
    }
  }, [dateRange, listing.price])

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category)
  }, [listing.category])

  const location = listing.address.slice(listing.address.indexOf(',') + 2)

  const Map = useMemo(
    () => dynamic(() => import('../../components/Map'), { ssr: false }),
    [location]
  )

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
              listing={listing}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDateRange={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCheckout}
                disabled={isLoading}
                disabledDates={disabledDates}
                isOwner={listing.userId === currentUser?.id}
              />
            </div>
          </div>

          {/* Continue ListingInfo here because map and reviews not inside grid */}
          <ListingReview listing={listing} />
          <hr />
          <div className="text-xl font-bold">{"Where you'll be"}</div>
          <div className="font-light text-neutral-500 mt-2">{`${location}`}</div>
          <div style={{ height: '50px' }}>
            <Map
              address={location}
              showLocationTips={true}
              zoomIn={false}
              largeMap
            />
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ListingClient
