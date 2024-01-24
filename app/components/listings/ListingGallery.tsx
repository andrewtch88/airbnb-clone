import Image from 'next/image'
import React from 'react'
import Heading from '../Heading'

interface ListingGalleryProps {
  images: string[]
}

const ListingGallery: React.FC<ListingGalleryProps> = ({ images }) => {
  const skipThumbnailImages = images.slice(1)
  return (
    <>
      <Heading title="" subtitle="Property Gallery" center />
      <div className="w-full h-[40vh] rounded-lg object-cover flex space-x-2 overflow-x-auto">
        {skipThumbnailImages.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Photo ${index + 1}`}
            width={350}
            height={350}
            // className="w-150 h-150 object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ))}
      </div>
    </>
  )
}

export default ListingGallery
