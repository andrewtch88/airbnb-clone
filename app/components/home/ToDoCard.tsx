import StarRating from '../inputs/StarRating'
import Image from 'next/image'
import { IoStar } from 'react-icons/io5'

interface PlaceCardProps {
  result: any
}

const PlaceCard: React.FC<PlaceCardProps> = ({ result }) => {
  return (
    <>
      {/* Place card is rendered if place prop is received */}
      {result && (
        <div className="outline-none flex flex-col">
          {/* Place Photo is rendered if found, or a default image is rendered as fallback */}
          <div className="w-full h-[250px] mb-4">
            <Image
              src={
                result?.photos?.length > 0
                  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${result.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GMAP_API_KEY}`
                  : 'https://media-cdn.tripadvisor.com/media/photo-s/22/d9/7b/42/this-image-has-been-removed.jpg'
              }
              className="object-cover w-full h-full hover:brightness-125 cursor-pointer"
              alt={result.name}
              width={400}
              height={250}
            />
          </div>

          {/* Place Name is rendered */}
          <h3 className="text-lg font-semibold">{result?.name}</h3>

          {/* Place Rating with place.rating value passed into component to render star rating */}
          <span className="flex items-center text-md font-light">
            <IoStar className="mr-1 block w-4 h-4 fill-current" />
            {`${Number(result?.rating)}`} ~ {result?.user_ratings_total} Reviews
          </span>
        </div>
      )}
    </>
  )
}

export default PlaceCard
