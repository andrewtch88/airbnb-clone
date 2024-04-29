'use client'

import { safeListing } from '@/app/types'
import { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import Button from '../Button'
import ReviewItem from '../listings/ListingReviewItem'
import { MdCheckCircleOutline } from 'react-icons/md'
import { GrKey } from 'react-icons/gr'
import { IoChatboxOutline, IoStar } from 'react-icons/io5'
import { CiMap } from 'react-icons/ci'
import { IoPricetagOutline } from 'react-icons/io5'
import '../../globals.css'

interface ReviewModalProps {
  listing: safeListing
}

const ShowAllReview: React.FC<ReviewModalProps> = ({ listing }) => {
  const [showAllReview, setShowAllReview] = useState(false)

  if (showAllReview) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 text-white flex items-center justify-center">
        <div className="bg-white p-8 grid gap-4 max-h-screen overflow-y-auto max-w-6xl mx-auto">
          <button
            onClick={() => setShowAllReview(false)}
            type="button"
            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <IoMdClose size={18} />
          </button>

          <div className="grid grid-cols-6 gap-8 mobile-view">
            {/* <!-- Review Stats --> */}
            <section
              aria-labelledby="reviews-stats"
              className="col-span-2 pt-10 pb-10 bg-white"
            >
              <div className="mt-1 text-2xl font-medium leading-6 text-gray-900 flex items-center">
                <IoStar className="inline h-5 w-5 fill-current me-2" />
                <span>
                  {listing.averageRating.toFixed(2)} {' - '}{' '}
                  {listing.reviewCount} reviews
                </span>
              </div>

              {/* <!-- Review category stats --> */}
              <div className="gap-4 mt-8 divide-y">
                <div className="pr-2 mb-6">
                  <h4 className="text-sm font-medium text-gray-900">
                    Overall rating
                  </h4>
                  <div className="mt-2">
                    <h3 className="sr-only">Review categories</h3>

                    <dl className="space-y-0">
                      {Array.from({ length: 5 }, (_, index) => 5 - index).map(
                        (number) => (
                          <div
                            key={number}
                            className="flex items-center text-xs"
                          >
                            <dt className="flex flex-1 items-center">
                              <p className="w-3 font-medium text-gray-900">
                                {number}
                                <span className="sr-only"> star reviews</span>
                              </p>
                              <div
                                aria-hidden="true"
                                className="ml-1 flex flex-1 items-center"
                              >
                                <div className="relative ml-1 flex-1">
                                  <div className="h-1 rounded-full border border-gray-200 bg-gray-200"></div>
                                  <div
                                    style={{
                                      width: `${
                                        ((listing?.overallRatingCounts?.[
                                          number
                                        ] || 0) *
                                          100) /
                                        listing.reviewCount
                                      }%`,
                                    }}
                                    className="absolute inset-y-0 rounded-full border border-black bg-black"
                                  ></div>
                                </div>
                              </div>
                            </dt>
                          </div>
                        )
                      )}
                    </dl>
                  </div>
                </div>

                <div className="hidden md:block">
                  <div className="flex items-center py-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      aria-hidden="true"
                      role="presentation"
                      focusable="false"
                      className="flex-none h-6 w-6 fill-current text-gray-900"
                    >
                      <path d="M24 0v6h-4.3c.13 1.4.67 2.72 1.52 3.78l.2.22-1.5 1.33a9.05 9.05 0 0 1-2.2-5.08c-.83.38-1.32 1.14-1.38 2.2v4.46l4.14 4.02a5 5 0 0 1 1.5 3.09l.01.25.01.25v8.63a3 3 0 0 1-2.64 2.98l-.18.01-.21.01-12-.13A3 3 0 0 1 4 29.2L4 29.02v-8.3a5 5 0 0 1 1.38-3.45l.19-.18L10 12.9V8.85l-4.01-3.4.02-.7A5 5 0 0 1 10.78 0H11zm-5.03 25.69a8.98 8.98 0 0 1-6.13-2.41l-.23-.23A6.97 6.97 0 0 0 6 21.2v7.82c0 .51.38.93.87 1H7l11.96.13h.13a1 1 0 0 0 .91-.88l.01-.12v-3.52c-.34.04-.69.06-1.03.06zM17.67 2H11a3 3 0 0 0-2.92 2.3l-.04.18-.01.08 3.67 3.1h2.72l.02-.1a4.29 4.29 0 0 1 3.23-3.4zM30 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-3-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-5 0h-2.33v2H22zm8-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM20 20.52a3 3 0 0 0-.77-2l-.14-.15-4.76-4.61v-4.1H12v4.1l-5.06 4.78a3 3 0 0 0-.45.53 9.03 9.03 0 0 1 7.3 2.34l.23.23A6.98 6.98 0 0 0 20 23.6z"></path>
                    </svg>
                    <h4 className="grow ms-4 text-sm font-medium text-gray-900">
                      Cleanliness
                    </h4>
                    <p className="flex-none text-xs font-medium text-gray-900">
                      {listing.ratingCategoriesAvg?.cleanlinessRating.toFixed(
                        1
                      )}
                    </p>
                  </div>

                  <div className="flex items-center py-4">
                    <MdCheckCircleOutline size={24} className="text-gray-900" />
                    <div className="ms-4 flex items-center grow">
                      <h4 className="text-sm font-medium text-gray-900 mr-auto">
                        Accuracy
                      </h4>
                      <p className="text-xs font-medium text-gray-900 ml-2">
                        {listing.ratingCategoriesAvg?.accuracyRating.toFixed(1)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center py-4">
                    <GrKey size={24} className="text-gray-900" />
                    <h4 className="grow ms-4 text-sm font-medium text-gray-900">
                      Check-in
                    </h4>
                    <p className="text-xs font-medium text-gray-900">
                      {listing.ratingCategoriesAvg?.checkIn_Rating.toFixed(1)}
                    </p>
                  </div>

                  <div className="flex items-center py-4">
                    <IoChatboxOutline size={24} className="text-gray-900" />
                    <div className="ms-4 flex items-center grow">
                      <h4 className="text-sm font-medium text-gray-900 mr-auto">
                        Communication
                      </h4>
                      <p className="text-xs font-medium text-gray-900 ml-2">
                        {listing.ratingCategoriesAvg?.communicationRating.toFixed(
                          1
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center py-4">
                    <CiMap size={26} className="text-gray-900" />
                    <h4 className="grow ms-4 text-sm font-medium text-gray-900">
                      Location
                    </h4>
                    <p className="text-xs font-medium text-gray-900">
                      {listing.ratingCategoriesAvg?.locationRating.toFixed(1)}
                    </p>
                  </div>

                  <div className="flex items-center py-4">
                    <IoPricetagOutline size={24} className="text-gray-900" />
                    <h4 className="grow ms-4 text-sm font-medium text-gray-900">
                      Value
                    </h4>
                    <p className="text-xs font-medium text-gray-900">
                      {listing.ratingCategoriesAvg?.valueRating.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* <!-- Review items--> */}
            <section
              aria-labelledby="reviews-items"
              className="col-span-4 pt-10 lg:pt-16"
            >
              <div className="space-y-10">
                <div className="space-y-8 lg:space-y-0">
                  {listing &&
                    listing.reviews &&
                    listing.reviews.map((review) => (
                      <div key={review.id} className="overflow-x-hidden">
                        <ReviewItem review={review} />
                      </div>
                    ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Button
      onClick={() => setShowAllReview(true)}
      className="rounded-md bg-white px-4 py-3 text-sm font-medium text-gray-900 text-lg hover:bg-gray-50"
      outline
      label={`Show all ${listing.reviewCount} reviews`}
    />
  )
}

export default ShowAllReview
