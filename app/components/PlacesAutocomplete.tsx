import { useMemo, useRef, useState } from 'react'
import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api'
import type { Libraries } from '@googlemaps/js-api-loader'
import dynamic from 'next/dynamic'

interface ContainerProps {
  children: React.ReactNode
  noMapOnSmallScreens?: boolean
}

const PlacesAutocomplete: React.FC<ContainerProps> = ({
  children,
  noMapOnSmallScreens,
}) => {
  const [address, setAddress] = useState('Malaysia')

  const Map = useMemo(() => dynamic(() => import('./Map'), { ssr: false }), [
    address,
  ])

  const inputRef = useRef(null)

  const handlePlaceChanged = () => {
    // @ts-ignore
    const [place] = inputRef.current.getPlaces()
    if (place) {
      setAddress(place.formatted_address)
    }
  }

  const libraries = useRef<Libraries>(['places'])

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GMAP_PLACES_API_KEY as string,
    libraries: libraries.current,
  })

  if (!isLoaded) {
    return null // or return a loading indicator or fallback
  }

  return (
    <>
      <StandaloneSearchBox
        onPlacesChanged={handlePlaceChanged}
        // @ts-ignore
        onLoad={(ref) => (inputRef.current = ref)}
      >
        <div className="mt-[-30px]">{children}</div>
      </StandaloneSearchBox>

      {noMapOnSmallScreens ? (
        <div className="hidden sm:block">
          <Map address={address} zoomIn={true} showLocationTips={false} />
        </div>
      ) : (
        <Map address={address} zoomIn={true} showLocationTips={false} />
      )}
    </>
  )
}

export default PlacesAutocomplete
