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
      <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
        <Image
          alt="image"
          src={imageSrc[0]}
          fill
          className="object-cover w-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={true}
        />
        <div className="absolute top-5 right-5">
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>
      </div>
      <div className="container mx-auto mt-8">
        <ListingGallery images={imageSrc} />
      </div>
    </>
  )
}

export default ListingHead
