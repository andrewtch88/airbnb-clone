'use client'

import { safeListing, safeReservation, SafeUser } from '@/app/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { categories } from '@/app/components/navbar/Categories'
import Container from '@/app/components/Container'
import ListingHead from '../../components/listing/ListingHead'
import ListingInfo from '@/app/components/listing/ListingInfo'
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
import ListingReservation from '@/app/components/listing/ListingReservation'
import { Range } from 'react-date-range'
import dynamic from 'next/dynamic'
import ListingReview from '@/app/components/listing/ListingReview'
import Button from '@/app/components/Button'
import Image from 'next/image'

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
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              listing={listing}
              region={listing.city + ', ' + listing.country}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
            />

            <div className="md:col-span-3">
              {/* Contact Host */}
              {listing?.user?.id !== currentUser?.id && (
                <div className="w-full mb-6 md:mb-0 md:order-first">
                  <div className="bg-white border border-gray-200 rounded-lg shadow">
                    <div className="flex flex-col items-center pb-10">
                      <Image
                        className="w-24 h-24 mb-3 rounded-full shadow-lg"
                        src={listing?.user?.image || '/images/placeholder.jpg'}
                        alt="Host profile pic"
                        width={200}
                        height={200}
                      />
                      <h5 className="mb-1 text-xl font-medium text-gray-900">
                        {listing?.user?.name}
                      </h5>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Host
                      </span>
                      <div className="flex mt-4 md:mt-6">
                        <Button
                          disabled={isLoading}
                          label="Message Host"
                          outline
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-black dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                          onClick={() =>
                            router.push(`/myInbox/${listing?.user?.id}`)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* ListingReservation */}
              <div className="order-last md:order-none mt-6">
                <div className="w-full">
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
