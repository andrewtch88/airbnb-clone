'use client'

import Heading from '@/app/components/Heading'
import HeartButton from '@/app/components/HeartButton'
import { SafeUser } from '@/app/types'
import Image from 'next/image'
import ListingGallery from './ListingGallery'

interface ListingHeadProps {
  title: string
  imageSrc: string[]
  id: string
  currentUser?: SafeUser | null
  region: string
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  imageSrc,
  id,
  currentUser,
  region,
}) => {
  return (
    <>
      <Heading title={title} subtitle={region} />
      <>
        <ListingGallery
          images={imageSrc}
          title={title}
          listingId={id}
          currentUser={currentUser}
        />
      </>
    </>
  )
}

export default ListingHead
