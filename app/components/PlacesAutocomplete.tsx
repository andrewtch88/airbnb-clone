import { useRef } from 'react'
import { StandaloneSearchBox, LoadScript } from '@react-google-maps/api'

// google places autocomplete (search places results suggestions)
const PlacesAutocomplete = () => {
  const inputRef = useRef()

  const handlePlaceChanged = () => {
    const [place] = inputRef.current.getPlaces()
    if (place) {
      console.log(place.formatted_address)
    }
  }

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GMAP_PLACES_API_KEY as string}
      libraries={['places']}
    >
      <StandaloneSearchBox
        onPlacesChanged={handlePlaceChanged}
        onLoad={(ref) => (inputRef.current = ref)}
      >
        <input type="text" placeholder="Enter property location" />
      </StandaloneSearchBox>
    </LoadScript>
  )
}

export default PlacesAutocomplete
