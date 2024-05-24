// 'use client'

import { safeReview } from '@/app/types'
import Avatar from '../Avatar'
import { format } from 'date-fns'
import { IoStar } from 'react-icons/io5'
import ShowMoreText from 'react-show-more-text'

interface ReviewItemProps {
  review: safeReview
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const date = new Date(review.createdAt)

  const formattedDate = format(date, 'MMM yyyy')

  return (
    <div className="flex flex-col py-4">
      <div className="flex items-center">
        {review.user.image ? (
          <Avatar src={review.user.image} />
        ) : (
          <Avatar src={null} />
        )}
        <div>
          <p className="text-base text-gray-900 ms-4">{review.user.name}</p>
        </div>
      </div>

      <div className="mt-2 flex items-center">
        <div className="flex items-center">
          {Array.from({ length: 5 }, (_, index) => (
            <>
              <div key={index}>
                <IoStar
                  className={`${
                    parseInt(review.finalRating.toFixed(0)) >= index + 1
                      ? 'text-black'
                      : 'text-gray-300'
                  } h-3 w-3 flex-shrink-0 fill-current`}
                />
              </div>
            </>
          ))}
        </div>
        <div className="text-sm text-black font-medium ml-2">
          {formattedDate}
        </div>
      </div>

      <div className="mt-6 sm:mt-0">
        <ShowMoreText
          lines={2}
          more={
            <span className="underline text-gray-900 font-medium">
              Show more
            </span>
          }
          less={
            <div className="mt-2">
              <span className="underline text-gray-900 font-medium">
                Show less
              </span>
            </div>
          }
          className="mt-3 space-y-6 text-base text-gray-600"
          truncatedEndingComponent={'... '}
        >
          {review.review}
        </ShowMoreText>
      </div>
    </div>
  )
}

export default ReviewItem
