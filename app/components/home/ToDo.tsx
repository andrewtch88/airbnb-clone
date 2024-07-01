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
            {japanData.results.map((result, index) => (
              <SwiperSlide key={`japan-${index}`}>
                <PlaceCard result={result} />
              </SwiperSlide>
            ))}

            {franceData.results
              .filter((result) => !result.name.includes('France'))
              .map((result, index) => (
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
          </Swiper>
        </>
      )}
    </div>
  )
}

export default ToDo
