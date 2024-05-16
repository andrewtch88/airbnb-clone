'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { safeListing } from '../types'
import axios from 'axios'
import Image from 'next/image'
import { IoStar } from 'react-icons/io5'
import Button from '../components/Button'

const bookingConfirmationClient = () => {
  const [listing, setListing] = useState<safeListing | null>(null)

  const params = useSearchParams()
  const listingId = params?.get('listingId')
  const dayCount = params?.get('dayCount')
  let totalPrice = 0

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/listings/${listingId}`)
      setListing(response.data)
    }

    fetchData()
  }, [listingId])

  if (listing && dayCount) {
    totalPrice = listing.price * Number(dayCount)
  }

  let start: Date | undefined = new Date()
  let end: Date | undefined = new Date()

  const startDate = params?.get('startDate')
  const endDate = params?.get('endDate')

  if (startDate && endDate) {
    start = new Date(startDate)
    end = new Date(endDate)
  }

  //   const onCreateReservation = useCallback(async () => {
  //   if (!currentUser) {
  //     toast.error('You must be logged in to create a reservation')
  //     return loginModal.onOpen()
  //   }
  //   setIsLoading(true)
  //   await axios
  //     .post('/api/reservations', {
  //       totalPrice,
  //       startDate: dateRange.startDate,
  //       endDate: dateRange.endDate,
  //       listingId: listing?.id,
  //     })
  //     .then(() => {
  //       setDateRange(initialDateRange)
  //       router.push('/myTrips')
  //       toast.success('Listing reserved!', { duration: 5000 })
  //     })
  //     .catch((error) => {
  //       if (error.response?.data?.error) {
  //         toast.error(error.response.data.error, { duration: 5000 })
  //       } else {
  //         toast.error('Something went wrong')
  //       }
  //     })
  //     .finally(() => {
  //       setIsLoading(false)
  //     })
  // }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal])

  return (
    <div className="bg-white">
      <main className="pt-4 pb-16">
        <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-4 lg:grid-rows-[auto,auto,1fr] lg:gap-x-24 lg:px-8">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-medium leading-6 text-gray-900">
              Confirm and pay
            </h2>

            <div className="mt-12">
              <h3 className="text-2xl font-medium text-gray-900">Your trip</h3>
              <div className="flex justify-between mt-4">
                <p className="font-medium">Dates</p>
                <p className="font-medium">{`${format(start, 'PP')} - ${format(
                  end,
                  'PP'
                )}`}</p>
              </div>
            </div>

            <div className="mt-12 border-t border-gray-300 pt-12">
              <h3 className="text-2xl font-medium text-gray-900">
                Ground rules
              </h3>
              <p className="mt-6 font-light">
                We ask every guest to remember a few simple things about what
                makes a great guest.
              </p>
              <ul className="font-light list-disc ms-4 mt-4">
                <li>Follow the house rules</li>
                <li>Treat your Host's home like your own</li>
              </ul>
            </div>

            <div className="mt-8 border-t border-gray-300 pt-12">
              <Button
                label="Confirm and pay"
                className="w-full text-center text-white bg-red-500 hover:bg-red-600 focus:bg-red-600 active:bg-red-700 active:border-red-700 active:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl h-12"
              />
            </div>
          </div>

          <div className="mt-4 lg:mt-0 border border-gray-300 lg:col-span-2 rounded-xl p-6 h-min">
            <h2 className="sr-only">Booking information</h2>
            <div className="flex items-center">
              <div className="aspect-square w-60 relative overflow-hidden rounded-xl">
                <Image
                  alt="data"
                  src={listing?.imageSrc[0]}
                  fill
                  className="object-cover h-50 w-50 group-hover:scale-110 transition select-none"
                  sizes="( min-width: 640px) 640px, 100vw"
                />
              </div>
              <div className="ml-3 text-2xl text-black font-medium">
                <div>
                  {listing?.title} in {listing?.region}
                </div>
                {listing?.reviewCount == 0 ? (
                  <span className="mt-2 text-xl font-medium leading-6 text-gray-900 flex items-center">
                    <IoStar className="inline h-6 w-6 fill-current me-2" />
                    No reviews (yet)
                  </span>
                ) : (
                  <div className="mt-2 text-xl font-medium leading-6 text-gray-900 flex items-center">
                    <IoStar className="inline h-6 w-6 fill-current me-2" />
                    <span>
                      {listing?.averageRating.toFixed(2)} (
                      {listing?.reviewCount} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="relative py-6">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-900">
                Price details
              </h3>
              <div className="flex justify-between font-light mt-6">
                <p>
                  RM{listing?.price} x {dayCount} night
                </p>
                <p>RM{totalPrice}</p>
              </div>
            </div>
            <div className="relative py-6">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </div>
            <div className="flex justify-between font-medium">
              <p>Total</p>
              <p>RM{totalPrice}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default bookingConfirmationClient
