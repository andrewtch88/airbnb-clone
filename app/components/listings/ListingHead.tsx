'use client'

import Heading from '@/app/components/Heading'
import HeartButton from '@/app/components/HeartButton'
import useCountries from '@/app/hooks/useCountries'
import { SafeUser } from '@/app/types'
import Image from 'next/image'
import countries from 'i18n-iso-countries'
import ListingGallery from './ListingGallery'
import enLocale from 'i18n-iso-countries/langs/en.json'

interface ListingHeadProps {
  title: string
  imageSrc: string[]
  id: string
  currentUser?: SafeUser | null
  locationValue: string
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  imageSrc,
  id,
  currentUser,
  locationValue,
}) => {
  countries.registerLocale(enLocale)
  const { getByValue } = useCountries()

  const location = countries.getAlpha2Code(locationValue, 'en')
  const country = getByValue(location as string)

  return (
    <>
      <Heading
        title={title}
        subtitle={`${country?.region}, ${country?.label}`}
      />
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
