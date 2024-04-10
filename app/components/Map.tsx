'use client'

import L, { LatLngExpression } from 'leaflet'
import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  Tooltip,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import { setKey, fromAddress } from 'react-geocode'
import RecenterMap from './RecenterMap'

setKey(process.env.NEXT_PUBLIC_GMAP_GEOCODING_API_KEY as string)

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
})

interface MapProps {
  center?: number[]
  address?: string
  showLocationTips?: boolean
  zoomIn?: boolean
}

const Map: React.FC<MapProps> = ({
  center,
  address,
  showLocationTips,
  zoomIn,
}) => {
  const [coordinates, setCoordinates] = useState<LatLngExpression | null>(null)

  const calculateZoom = () => {
    if (address && zoomIn) {
      return 15
    } else if (address && !zoomIn) {
      return 14
    } else {
      return 4
    }
  }

  useEffect(() => {
    if (address) {
      fromAddress(address).then(
        (response) => {
          setCoordinates(response.results[0].geometry.location)
        },
        (error) => {
          console.error(error)
        }
      )
    }
  }, [address])

  return (
    <>
      {address && coordinates && (
        <MapContainer
          center={coordinates}
          zoom={calculateZoom()}
          scrollWheelZoom={false}
          className="h-[35vh] rounded-lg"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {address && <Marker position={coordinates} />}

          <RecenterMap coordinate={coordinates} />

          {showLocationTips && (
            <CircleMarker
              center={coordinates}
              pathOptions={{ color: 'red' }}
              radius={80}
            >
              <Tooltip direction="top" permanent offset={[-3, -30]}>
                Exact location provided after booking.
              </Tooltip>
            </CircleMarker>
          )}
        </MapContainer>
      )}
    </>
  )
}

export default Map
