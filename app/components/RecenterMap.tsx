import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'

interface RecenterMapProps {
  coordinate?: LatLngExpression
}

const RecenterMap: React.FC<RecenterMapProps> = ({ coordinate }) => {
  const map = useMap()

  useEffect(() => {
    const recenterMap = () => {
      if (coordinate) {
        // Set the map view using the provided coordinate
        map.setView(coordinate)
      }
    }

    recenterMap()
  }, [coordinate, map])

  // Return null if no return JSX
  return null
}

export default RecenterMap
