'use client'

import Modal from './Modal'
import useRentModal from '@/app/hooks/useRentModal'
import { useMemo, useState } from 'react'
import Heading from '../Heading'
import { categories } from '../navbar/Categories' // this imports the categories array instead of the Categories component
import CategoryInput from '../inputs/CategoryInput'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from '../inputs/Input'
import dynamic from 'next/dynamic'
import PlacesAutocomplete from '../PlacesAutocomplete'
import { useRef } from 'react'
import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api'
import type { Libraries } from '@googlemaps/js-api-loader'
import Counter from '../inputs/Counter'
import ImageUpload from '../inputs/ImageUpload'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

// modal form for renting a home on Bearbnb

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () => {
  const rentModal = useRentModal()
  const router = useRouter()

  const [step, setStep] = useState(STEPS.CATEGORY)
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState('Malaysia')

  const {
    register,
    handleSubmit,
    formState: { errors }, // to control form errors required
    watch,
    setValue,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      description: '',
      imageSrc: '',
      category: '',
      roomCount: 1,
      bathroomCount: 1,
      guestCount: 1,
      address: '',
      price: 1,
    },
  })

  // normally use register to get form values, but now using custom UI, so use watch instead
  const category = watch('category')
  const guestCount = watch('guestCount') // these variables defaultValues take from the useForm<FieldValues> on above
  const roomCount = watch('roomCount')
  const bathroomCount = watch('bathroomCount')
  const imageSrc = watch('imageSrc')

  const Map = useMemo(() => dynamic(() => import('../Map'), { ssr: false }), [
    address,
  ])

  // a function that remembers the form input, really nice!
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true, // marked as user interacted
      shouldTouch: true, // user has interacted with the field, for handling validation messages or styles
      shouldValidate: true,
    })
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return nextPage()
    }

    setIsLoading(true)

    // TODO: send the data to API
    axios
      .post('/api/listings', data)
      .then(() => {
        toast.success('Listing created!')
        router.refresh()
        reset()
        setStep(STEPS.CATEGORY)
        rentModal.onClose()
      })
      .catch((error) => {
        if (error.response?.data?.error) {
          toast.error(error.response.data.error, { duration: 5000 })
        } else {
          toast.error('Something went wrong')
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  const prevPage = () => {
    setStep((value) => value - 1)
  }

  const nextPage = () => {
    setStep((value) => value + 1)
  }

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return 'Create'
    }

    return 'Next'
  }, [step])

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined
    }

    return 'Back'
  }, [step])

  // let variable is changeable in the future, unlike const (other steps will reassign the bodyContent var)
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              // value of category passed into SetCustomValue
              selected={category === item.label}
              onClick={(category) => setCustomValue('category', category)}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  )

  const inputRef = useRef()

  const handlePlaceChanged = () => {
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

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your place located?"
          subtitle="Your address is only shared with guests after they've reserved"
        />
        {/* <PlacesAutocomplete /> */}

        {isLoaded && (
          <StandaloneSearchBox
            onPlacesChanged={handlePlaceChanged}
            onLoad={(ref) => (inputRef.current = ref)}
          >
            <div className="mt-[-30px]">
              <Input
                id="address"
                label="Enter property location"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
            </div>
          </StandaloneSearchBox>
        )}
        <Map address={address} zoomIn={false} showLocationTips={false} />
      </div>
    )
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your place"
          subtitle="What amenities do you have?"
        />
        <Counter
          onChange={(value) => setCustomValue('guestCount', value)}
          value={guestCount}
          title="Guests"
          subtitle="How many guests do you allow?"
        />
        <hr />
        <Counter
          onChange={(value) => setCustomValue('roomCount', value)}
          value={roomCount}
          title="Rooms"
          subtitle="How many rooms do you have?"
        />
        <hr />
        <Counter
          onChange={(value) => setCustomValue('bathroomCount', value)}
          value={bathroomCount}
          title="Bathrooms"
          subtitle="How many bathrooms do you have?"
        />
      </div>
    )
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <div className="mt-[-25px]">
          <Heading title="Add a photo of your place" subtitle="" />
        </div>
        <ImageUpload
          value={imageSrc}
          onChange={(value) => setCustomValue('imageSrc', value)}
        />
      </div>
    )
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your place?"
          subtitle="Short and sweet works best!"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per night?"
        />
        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    )
  }

  return (
    <Modal
      title="Airbnb your home!"
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : prevPage}
      body={bodyContent}
    />
  )
}

export default RentModal
