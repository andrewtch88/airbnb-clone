'use client'

import Modal from './Modal'
import useEditModal from '@/app/hooks/useEditModal'
import { useEffect, useMemo, useState } from 'react'
import Heading from '../Heading'
import { categories } from '../navbar/Categories' // this imports the categories array instead of the Categories component
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from '../inputs/Input'
import PlacesAutocomplete from '../PlacesAutocomplete'
import Counter from '../inputs/Counter'
import ImageUpload from '../inputs/ImageUpload'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import CategorySelectOption from '../inputs/CategorySelectOption'
import TextArea from '../inputs/TextArea'
import { safeListing } from '@/app/types'

// import { useGlobalContext } from '../../contextAPI/EditListingContext'

interface EditListingModalProps {
  listing: safeListing | null
}

const EditListingModal: React.FC<EditListingModalProps> = ({ listing }) => {
  const editModal = useEditModal()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const getDefaultCategory = (category: any) => {
    const defaultCategory = categories.find((cat) => cat.label === category)
    return defaultCategory || null
  }

  const {
    register,
    handleSubmit,
    formState: { errors }, // to control form errors required
    watch,
    setValue,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      title: listing?.title || '',
      description: listing?.description || '',
      imageSrc: listing?.imageSrc || '',
      category: getDefaultCategory(listing?.category) || '',
      roomCount: listing?.roomCount || 1,
      bathroomCount: listing?.bathroomCount || 1,
      guestCount: listing?.guestCount || 1,
      address: listing?.address || '',
      price: listing?.price || 1, // form fields' default values
      city: listing?.city || '',
    },
  })

  useEffect(() => {
    if (editModal.isOpen) {
      reset({
        title: listing?.title || '',
        description: listing?.description || '',
        imageSrc: listing?.imageSrc || '',
        category: getDefaultCategory(listing?.category) || '',
        roomCount: listing?.roomCount || 1,
        bathroomCount: listing?.bathroomCount || 1,
        guestCount: listing?.guestCount || 1,
        address: listing?.address || '',
        price: listing?.price || 1,
        city: listing?.city || '',
      })
    } else {
      reset()
    }
  }, [editModal.isOpen, listing, reset])

  const category = watch('category')
  const guestCount = watch('guestCount') // these variables defaultValues take from the useForm<FieldValues> on above
  const roomCount = watch('roomCount')
  const bathroomCount = watch('bathroomCount')
  const imageSrc = watch('imageSrc')

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true, // field value changed
      shouldTouch: true, // user has interacted with the field, for handling validation messages or styles
      shouldValidate: true,
    })
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    data.category = data.category.label

    axios
      .put(`/api/listings/${listing?.id}`, data)
      .then(() => {
        toast.success('Listing updated')
        editModal.onClose()
        router.refresh()
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

  let bodyContent = (
    <>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh]">
          <Heading title="" subtitle="Accommodation theme / category" />
          <CategorySelectOption
            value={category}
            onChange={(value) => setCustomValue('category', value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <Heading title="" subtitle="Property Title and Description" />
          <Input
            id="title"
            label="Title"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <hr />
          <TextArea
            id="description"
            label="Description"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
        </div>

        <div className="-mb-7">
          <Heading title="" subtitle="Enter property address" />
        </div>
        <div>
          <div className="mt-2">
            <div className="mb-8">
              <Input
                id="city"
                label="City Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
            </div>
            <div>
              <PlacesAutocomplete>
                <Input
                  id="address"
                  label="Address"
                  disabled={isLoading}
                  register={register}
                  errors={errors}
                  required
                />
              </PlacesAutocomplete>
            </div>
          </div>
        </div>

        <div>
          <Heading title="" subtitle="Photos of your place" />
        </div>
        <div className="mt-[15px]">
          <ImageUpload
            value={imageSrc}
            onChange={(value) => setCustomValue('imageSrc', value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <Heading title="" subtitle="Amenities of your place" />
          <hr />
          <div className="mt-3">
            <Counter
              onChange={(value) => setCustomValue('guestCount', value)}
              value={guestCount}
              title="Guests"
              subtitle="Maximum guests"
              disabled={isLoading}
            />
            <hr />
            <Counter
              onChange={(value) => setCustomValue('roomCount', value)}
              value={roomCount}
              title="Rooms"
              subtitle="Available rooms"
              disabled={isLoading}
            />
            <hr />
            <Counter
              onChange={(value) => setCustomValue('bathroomCount', value)}
              value={bathroomCount}
              title="Bathrooms"
              subtitle="Available bathrooms"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <Heading title="" subtitle="Price per night" />
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
      </div>
    </>
  )

  const cancel = () => {
    editModal.onClose()
  }

  return (
    <Modal
      title={`Editing - ${listing?.title}`}
      isOpen={editModal.isOpen}
      onClose={editModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={'Update Listing'}
      secondaryActionLabel={'Cancel'}
      secondaryAction={cancel}
      body={bodyContent}
    />
  )
}

export default EditListingModal
