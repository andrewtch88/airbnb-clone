import { useState } from 'react'
import Image from 'next/image'
import HeartButton from '../HeartButton'
import { SafeUser } from '@/app/types'

interface ListingGalleryProps {
  images: string[]
  title: string
  listingId: string
  currentUser?: SafeUser | null
}

const ListingGallery: React.FC<ListingGalleryProps> = ({
  images,
  title,
  listingId,
  currentUser,
}) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false)

  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 text-white flex items-center justify-center">
        <div className="bg-black p-8 grid gap-4 max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl mr-8">Photos of {title}</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="flex gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
              Close photos
            </button>
          </div>
          {images?.length > 0 &&
            images.map((image, index) => (
              <div key={index}>
                <Image
                  src={image}
                  className="rounded-2xl max-h-[70vh] object-cover"
                  alt={`Photo ${index + 1}`}
                  width={700}
                  height={700}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
        </div>
      </div>
    )
  }

  // Preview Images (with show more photos button)
  return (
    <div className="relative">
      <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
        <div>
          {images?.[0] && (
            <div>
              <Image
                onClick={() => setShowAllPhotos(true)}
                className="aspect-square cursor-pointer"
                src={images[0]}
                alt=""
                width={700}
                height={700}
              />
            </div>
          )}
        </div>
        <div className="grid">
          {images?.[1] && (
            <Image
              onClick={() => setShowAllPhotos(true)}
              className="aspect-square cursor-pointer"
              src={images[1]}
              alt=""
              width={350}
              height={350}
            />
          )}
          <div className="overflow-hidden">
            {images?.[2] && (
              <Image
                onClick={() => setShowAllPhotos(true)}
                className="aspect-square cursor-pointer relative top-2"
                src={images[2]}
                alt=""
                width={350}
                height={350}
              />
            )}
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <HeartButton listingId={listingId} currentUser={currentUser} />
        </div>
      </div>

      <button
        onClick={() => setShowAllPhotos(true)}
        className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-md shadow-gray-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
            clipRule="evenodd"
          />
        </svg>
        Show more photos
      </button>
    </div>
  )
}

export default ListingGallery
