'use client'

import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import PlaceCardLoader from '../loaders/PlaceCardLoader'
import PlaceCard from './ToDoCard'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'

interface Photo {
  height: number
  html_attributions: string[]
  photo_reference: string
  width: number
}

interface Place {
  business_status?: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
    viewport: {
      northeast: {
        lat: number
        lng: number
      }
      southwest: {
        lat: number
        lng: number
      }
    }
  }
  icon: string
  icon_background_color: string
  icon_mask_base_uri: string
  name: string
  opening_hours?: {
    open_now: boolean
  }
  photos: Photo[]
  place_id: string
  plus_code?: {
    compound_code: string
    global_code: string
  }
  rating?: number
  types: string[]
  user_ratings_total: number
}

interface Places {
  html_attributions: []
  results: Place[]
  status: string
}

const tokyoDisneyland = {
  html_attributions: [],
  results: [
    {
      business_status: 'OPERATIONAL',
      formatted_address: '1-1 Maihama, Urayasu, Chiba 279-0031, Japan',
      geometry: {
        location: {
          lat: 35.6328964,
          lng: 139.8803943,
        },
        viewport: {
          northeast: {
            lat: 35.63923269999999,
            lng: 139.8826676,
          },
          southwest: {
            lat: 35.63078430000001,
            lng: 139.8735744,
          },
        },
      },
      icon:
        'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png',
      icon_background_color: '#7B9EB0',
      icon_mask_base_uri:
        'https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet',
      name: 'Tokyo Disneyland',
      opening_hours: {
        open_now: true,
      },
      photos: [
        {
          height: 4000,
          html_attributions: [
            '\u003ca href="https://maps.google.com/maps/contrib/103182151579405941913"\u003e杉山隆史\u003c/a\u003e',
          ],
          photo_reference:
            'AUGGfZlFlPnCwgliFYDaB2FNaUPndO4V16wmGQRjUPYZsDIN0YXAHVBzJhtlN185AF6y5YaqWpSDc4ix_D79m3VZDr9HfVl16bfGJPYQSc4ROEsmzfVZ7kb3-HtOvSyKCnJmOgp2bOXRyg3D1sSwF0KsLkDAb7RMSTTpHQD3NKbK4-YcaWBq',
          width: 3000,
        },
      ],
      place_id: 'ChIJszdHEQN9GGARy9MJ1TY22eQ',
      plus_code: {
        compound_code: 'JVMJ+55 Urayasu, Chiba, Japan',
        global_code: '8Q7XJVMJ+55',
      },
      rating: 4.6,
      reference: 'ChIJszdHEQN9GGARy9MJ1TY22eQ',
      types: [
        'tourist_attraction',
        'amusement_park',
        'point_of_interest',
        'establishment',
      ],
      user_ratings_total: 104224,
    },
  ],
  status: 'OK',
}

const ToDo = () => {
  const [franceData, setFranceData] = useState<Places>()
  const [australiaData, setAustraliaData] = useState<Places>()
  const [japanData, setJapanData] = useState<Places>()

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/home')
      const { franceData, australiaData, japanData } = response.data

      setFranceData(franceData)
      setAustraliaData(australiaData)
      setJapanData(japanData)
    }
    fetchData()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h2 className="font-semibold text-2xl md:text-3xl mb-2">
        Top attractions for your next vacation
      </h2>
      {!franceData || !australiaData || !japanData ? (
        <PlaceCardLoader />
      ) : (
        <>
          <Swiper
            className="mySwiper"
            loop
            slidesPerView={4}
            spaceBetween={20}
            modules={[Navigation]}
            navigation
            breakpoints={{
              1920: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              // when window width is >= 1028px
              1028: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              // when window width is >= 990px
              990: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              // when window width is < 990px
              0: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
            }}
          >
            {tokyoDisneyland.results.map((result, index) => (
              <SwiperSlide key={`tokyo-${index}`}>
                <PlaceCard result={result} />
              </SwiperSlide>
            ))}

            {franceData.results.map((result, index) => (
              <SwiperSlide key={`france-${index}`}>
                <PlaceCard result={result} />
              </SwiperSlide>
            ))}

            {australiaData.results
              .filter((result) => !result.name.includes('Australia'))
              .map((result, index) => (
                <SwiperSlide key={`australia-${index}`}>
                  <PlaceCard result={result} />
                </SwiperSlide>
              ))}

            {japanData.results.map((result, index) => (
              <SwiperSlide key={`japan-${index}`}>
                <PlaceCard result={result} />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  )
}

export default ToDo
