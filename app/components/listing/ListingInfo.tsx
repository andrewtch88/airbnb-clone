'use client'

import { safeListing, SafeUser } from '@/app/types'
import { IoStar } from 'react-icons/io5'
import Avatar from '../Avatar'
import ListingCategory from './ListingCategory'
import ShowMoreText from 'react-show-more-text'

interface ListingInfoProps {
  listing: safeListing
  category:
    | {
        label: string
        icon: React.ReactNode
        description: string
      }
    | undefined // two possible types | | , object or undefined for category
  description: string
  roomCount: number
  guestCount: number
  bathroomCount: number
  region: string
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  listing,
  category,
  description,
  roomCount,
  guestCount,
  bathroomCount,
  region,
}) => {
  return (
    <>
      <div className="col-span-4 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold flex flex-row items-center gap-2">
            <div>Located in {region}</div>
          </div>
          <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
            <div>{guestCount} guests</div>
            <div>{roomCount} rooms</div>
            <div>{bathroomCount} bathrooms</div>
          </div>
          <div className="flex justify-between">
            <p className="flex items-center text-md font-light">
              <IoStar className="me-1 mr-2 inline w-4 h-4 fill-current" />
              {listing.reviewCount !== 0 ? (
                <>
                  <span className="font-medium">
                    {listing.averageRating.toFixed(2)}
                    {' - '}
                    <span className="underline">
                      {listing.reviewCount} reviews
                    </span>
                  </span>
                </>
              ) : (
                <span className="font-light">No reviews yet</span>
              )}
            </p>
          </div>
        </div>
        <hr />
        {category && (
          <ListingCategory
            icon={category.icon}
            label={category.label}
            description={category.description}
          />
        )}
        <hr />
        <div className="mb-10">
          <ShowMoreText
            lines={6}
            more={
              <span className="underline text-gray-900 font-medium">
                Show more >
              </span>
            }
            less={
              <div className="mt-2">
                <span className="underline text-gray-900 font-medium">
                  Show less
                </span>
              </div>
            }
            className="text-lg font-light text-neutral-500 whitespace-pre-line"
            truncatedEndingComponent={'... '}
          >
            <p style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>
              {description}
            </p>
          </ShowMoreText>
        </div>
      </div>
    </>
  )
}

export default ListingInfo
