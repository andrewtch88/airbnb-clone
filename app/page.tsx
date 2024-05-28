'use client'

import Image from 'next/image'
import Search from './components/navbar/Search'
import './globals.css'
import ToVisit from './components/home/ToVisit'
import Button from './components/Button'
import { useRouter } from 'next/navigation'
import { IoIosStarOutline } from 'react-icons/io'
import { LiaSwimmingPoolSolid } from 'react-icons/lia'
import { GiMushroomHouse } from 'react-icons/gi'
import ToDo from './components/home/ToDo'

const Home = () => {
  const router = useRouter()

  return (
    <div className="container mx-auto p-4 relative flex flex-col items-center space-y-12">
      <div className="relative w-full md:h-[33em] h-[22em] flex justify-center">
        <Image
          className="object-cover contrast-125 select-none"
          alt="where to"
          src="https://a0.muscache.com/im/pictures/c8ba7316-48cc-407c-bbad-04116ff2c555.jpg"
          layout="fill"
          objectFit="cover"
          priority
          quality={100}
          unoptimized
        />
        {/* Search Input Field */}
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h1 className="select-none text-5xl font-bold text-center text-white drop-shadow-lg shadow-black">
            Find places to stay in anywhere
          </h1>
          <div className="mt-10 w-full flex justify-center">
            <Search />
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="font-bold text-2xl mb-4">
          View all properties instead?
        </h2>
        <Button label="View all" onClick={() => router.push('/listingsPage')} />
      </div>

      <div className="hidden md:flex justify-around p-8 w-full ">
        <div className="flex flex-col max-w-xs p-4">
          <GiMushroomHouse className="w-8 h-8 mb-4" />
          <h3 className="text-xl md:text-2xl font-semibold mb-2">
            Keep it personalized
          </h3>
          <p className="text-gray-600 text-md md:text-lg">
            Unique homes and unusual properties that traditional hotels can't
            match. Live like a local.
          </p>
        </div>
        <div className="flex flex-col max-w-xs p-4 lg:mr-8">
          <LiaSwimmingPoolSolid className="w-8 h-8 mb-4" />
          <h3 className="text-xl md:text-2xl font-semibold mb-2 lg:whitespace-nowrap">
            Get the amenities you want
          </h3>
          <p className="text-gray-600 text-md md:text-lg">
            Hot tubs, pools, BBQs—discover dozens of great extras that fit your
            needs.
          </p>
        </div>
        <div className="flex flex-col max-w-xs p-4 lg:ml-3">
          <IoIosStarOutline className="w-8 h-8 mb-4" />
          <h3 className="text-xl md:text-2xl font-semibold mb-2">
            Read real reviews
          </h3>
          <p className="text-gray-600 text-md md:text-lg">
            Find homes you’ll love based on the great experiences of people
            who’ve stayed there.
          </p>
        </div>
      </div>

      <div className="w-full">
        <ToVisit />
      </div>

      <div className="w-full">
        <ToDo />
      </div>
    </div>
  )
}

export default Home
