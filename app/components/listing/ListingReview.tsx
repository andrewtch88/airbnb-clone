'use client'

import { safeListing, SafeUser } from '@/app/types'
import { CiMap, CiStar } from 'react-icons/ci'
import { GrKey } from 'react-icons/gr'
import { IoChatboxOutline, IoPricetagOutline, IoStar } from 'react-icons/io5'
import { MdCheckCircleOutline } from 'react-icons/md'
import ReviewItem from './ListingReviewItem'
import ShowAllReview from './ShowAllReview'

interface ListingReviewProps {
  listing: safeListing
}

const ListingReview: React.FC<ListingReviewProps> = ({ listing }) => {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6 lg:max-w-7xl lg:px-8">
      {/*  Review Stats */}
      <section
        aria-labelledby="reviews-stats"
        className="border-t border-gray-200 pt-10 pb-10"
      >
        {listing.reviewCount == 0 ? (
          <span className="text-2xl font-medium leading-6 text-gray-900 flex items-center">
            <CiStar className="inline h-6 w-6 fill-current me-2" />
            No reviews (yet)
          </span>
        ) : (
          <div className="mt-1 text-2xl font-medium leading-6 text-gray-900 flex items-center">
            <IoStar className="inline h-5 w-5 fill-current me-2" />
            <span>
              {listing.averageRating.toFixed(2)} {' - '} {listing.reviewCount}{' '}
              reviews
            </span>
          </div>
        )}

        {/* <!-- Review category stats --> */}
        <div className="grid-cols-7 gap-4 mt-8 divide-x hidden lg:grid">
          <div className="pr-2">
            <h4 className="text-sm font-medium">Overall rating</h4>
            <div className="mt-2">
              <h3 className="sr-only">Review data</h3>

              <dl className="space-y-0">
                {Array.from({ length: 5 }, (_, index) => 5 - index).map(
                  (number) => (
                    <div key={number} className="flex items-center text-xs">
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
                                  ((listing?.overallRatingCounts?.[number] ||
                                    0) *
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

          <div className="ps-2 sm:ps-4 lg:ps-6">
            <h4 className="text-sm font-medium">Cleanliness</h4>
            <p className="text-lg font-medium">
              {listing.ratingCategoriesAvg?.cleanlinessRating.toFixed(1)}
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              aria-hidden="true"
              role="presentation"
              focusable="false"
              className="block h-8 w-8 fill-current mt-6"
            >
              <path d="M24 0v6h-4.3c.13 1.4.67 2.72 1.52 3.78l.2.22-1.5 1.33a9.05 9.05 0 0 1-2.2-5.08c-.83.38-1.32 1.14-1.38 2.2v4.46l4.14 4.02a5 5 0 0 1 1.5 3.09l.01.25.01.25v8.63a3 3 0 0 1-2.64 2.98l-.18.01-.21.01-12-.13A3 3 0 0 1 4 29.2L4 29.02v-8.3a5 5 0 0 1 1.38-3.45l.19-.18L10 12.9V8.85l-4.01-3.4.02-.7A5 5 0 0 1 10.78 0H11zm-5.03 25.69a8.98 8.98 0 0 1-6.13-2.41l-.23-.23A6.97 6.97 0 0 0 6 21.2v7.82c0 .51.38.93.87 1H7l11.96.13h.13a1 1 0 0 0 .91-.88l.01-.12v-3.52c-.34.04-.69.06-1.03.06zM17.67 2H11a3 3 0 0 0-2.92 2.3l-.04.18-.01.08 3.67 3.1h2.72l.02-.1a4.29 4.29 0 0 1 3.23-3.4zM30 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-3-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-5 0h-2.33v2H22zm8-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM20 20.52a3 3 0 0 0-.77-2l-.14-.15-4.76-4.61v-4.1H12v4.1l-5.06 4.78a3 3 0 0 0-.45.53 9.03 9.03 0 0 1 7.3 2.34l.23.23A6.98 6.98 0 0 0 20 23.6z"></path>
            </svg>
          </div>

          <div className="ps-2 sm:ps-4 lg:ps-6 ">
            <h4 className="text-sm font-medium">Accuracy</h4>
            <p className="text-lg font-medium">
              {listing.ratingCategoriesAvg?.accuracyRating.toFixed(1)}
            </p>
            <MdCheckCircleOutline className="block h-8 w-8 fill-current mt-6" />
          </div>

          <div className="ps-2 sm:ps-4 lg:ps-6 ">
            <h4 className="text-sm font-medium">Check-in</h4>
            <p className="text-lg font-medium">
              {listing.ratingCategoriesAvg?.checkIn_Rating.toFixed(1)}
            </p>
            <GrKey className="block h-8 w-8 fill-current mt-6" />
          </div>

          <div className="ps-2 sm:ps-4 lg:ps-6 ">
            <h4 className="text-sm font-medium">Communication</h4>
            <p className="text-lg font-medium">
              {listing.ratingCategoriesAvg?.communicationRating.toFixed(1)}
            </p>
            <IoChatboxOutline className="block h-8 w-8 mt-6 fill-current" />
          </div>

          <div className="ps-2 sm:ps-4 lg:ps-6 ">
            <h4 className="text-sm font-medium">Location</h4>
            <p className="text-lg font-medium">
              {listing.ratingCategoriesAvg?.locationRating.toFixed(1)}
            </p>
            <CiMap className="block h-10 w-10 fill-current mt-5" />
          </div>

          <div className="ps-2 sm:ps-4 lg:ps-6 ">
            <h4 className="text-sm font-medium">Value</h4>
            <p className="text-lg font-medium">
              {listing.ratingCategoriesAvg?.valueRating.toFixed(1)}
            </p>
            <IoPricetagOutline className="block h-8 w-8 mt-6 fill-current" />
          </div>
        </div>
      </section>

      {/* <!-- Review items--> */}
      <section
        aria-labelledby="reviews-items"
        className="border-t border-gray-200 pt-6 lg:pt-6"
      >
        <div className="space-y-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-8 lg:space-y-0">
            {/* Show latest reviews first.*/}
            {listing &&
              listing.reviews &&
              listing.reviews.slice(0, 6).map((review) => (
                <div key={review.id}>
                  <ReviewItem review={review} />
                </div>
              ))}
          </div>
          {listing.reviewCount > 1 && <ShowAllReview listing={listing} />}
        </div>
      </section>
    </div>
  )
}

export default ListingReview
