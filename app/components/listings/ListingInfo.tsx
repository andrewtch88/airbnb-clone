'use client'

import { SafeUser } from '@/app/types'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { IconType } from 'react-icons'
import Avatar from '../Avatar'
import ListingCategory from './ListingCategory'

interface ListingInfoProps {
  user: SafeUser
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
  address: string
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  category,
  description,
  roomCount,
  guestCount,
  bathroomCount,
  address,
}) => {
  const location = address.slice(address.indexOf(',') + 2)

  const Map = useMemo(() => dynamic(() => import('../Map'), { ssr: false }), [
    location,
  ])

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold flex flex-row items-center gap-2">
          <div>Hosted by {user?.name}</div>
          <Avatar src={user?.image} />
        </div>
        <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
          <div>{guestCount} guests</div>
          <div>{roomCount} rooms</div>
          <div>{bathroomCount} bathrooms</div>
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
      <div style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>
        <div className="text-lg font-light text-neutral-500">{description}</div>
      </div>

      <hr />
      <div className="text-xl font-bold">{"Where you'll be"}</div>
      <div className="font-light text-neutral-500 mt-2">{`${location}`}</div>
      {/* <Map center={coordinates} /> */}
      <Map address={location} showLocationTips={true} zoomIn={true} />
    </div>
  )
}

export default ListingInfo
