'use client'

import Modal from './Modal'
import useEditModal from '@/app/hooks/useEditModal'
import { useMemo, useState } from 'react'
import Heading from '../Heading'
import { categories } from '../navbar/Categories' // this imports the categories array instead of the Categories component
import ButtonInput from '../inputs/ButtonInput'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from '../inputs/Input'
import PlacesAutocomplete from '../PlacesAutocomplete'
import Counter from '../inputs/Counter'
import ImageUpload from '../inputs/ImageUpload'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import CategorySelectOption from '../inputs/CategorySelectOption'

// modal form to edit property listing

const EditListingModal = () => {
  const editModal = useEditModal()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

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
      price: 1, // form fields' default values
    },
  })

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

  const onSubmit = () => {}

  let bodyContent = (
    <>
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh]">
          <Heading title="" subtitle="Accommodation theme / category" />
          <CategorySelectOption
            value={category}
            onChange={(value) => setCustomValue('category', value)}
          />
        </div>
      </div>
    </>
  )

  return (
    <Modal
      title="Editing your home"
      isOpen={editModal.isOpen}
      onClose={editModal.onClose}
      onSubmit={onSubmit}
      actionLabel={'test 1'}
      secondaryActionLabel={'test'}
      secondaryAction={undefined}
      body={bodyContent}
    />
  )
}

export default EditListingModal
