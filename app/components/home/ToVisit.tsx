'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import '../../globals.css'
import PlaceCardLoader from '../loaders/PlaceCardLoader'
import Link from 'next/link'

const ToVisit = () => {
  const [listings, setListings] = useState<
    { country: string; count: number }[]
  >([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/listings/`)
      setListings(response.data)
    }

    fetchData()
  }, [])

  return (
    <div className="container mx-auto p-4 border-t border-gray-200">
      <h2 className="font-semibold text-2xl md:text-3xl mb-2">
        Top destinations for your next vacation
      </h2>
      <p className="text-lg md:text-xl text-dark mb-4">
        These countries are trending on Bearbnb.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {!listings || listings?.length < 1 ? (
          <PlaceCardLoader />
        ) : (
          listings?.map((listing, index) => (
            <div key={index} className="group cursor-pointer">
              {/* Country Photo is rendered if found, or a default image is rendered as fallback */}

              <Link href={`/listingsPage?country=${listing.country}`} passHref>
                <Image
                  src={`https://source.unsplash.com/random/250×250/?${listing.country}`}
                  className="w-full h-[250px] object-cover group-hover:brightness-125"
                  alt={listing?.country}
                  width={250}
                  height={250}
                />
                {/* Country name */}
                <h2 className="font-semibold text-lg group-hover:underline">
                  {listing.country}
                </h2>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ToVisit
