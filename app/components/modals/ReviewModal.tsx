'use client'

import useReviewModal from '@/app/hooks/useReviewModal'
import { safeReservation } from '@/app/types'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Modal from './Modal'
import Image from 'next/image'
import { IoStar } from 'react-icons/io5'
import TextArea from '../inputs/TextArea'
import StarRating from '../inputs/StarRating'
import toast from 'react-hot-toast'
import axios from 'axios'

interface ReviewModalProps {
  reservation: safeReservation | null
}

const ReviewModal: React.FC<ReviewModalProps> = ({ reservation }) => {
  const reviewModal = useReviewModal()
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
      review: '',
      cleanlinessRating: 0,
      communicationRating: 0,
      accuracyRating: 0,
      locationRating: 0,
      checkInRating: 0,
      valueRating: 0,
    },
  })

  useEffect(() => {
    if (!reviewModal.isOpen) {
      reset()
    }
  }, [reviewModal.isOpen, reset])

  const cleanlinessRating = watch('cleanlinessRating') // these variables defaultValues take from the useForm<FieldValues> on above
  const communicationRating = watch('communicationRating')
  const accuracyRating = watch('accuracyRating')
  const locationRating = watch('locationRating')
  const checkInRating = watch('checkInRating')
  const valueRating = watch('valueRating')

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true, // field value changed
      shouldTouch: true, // user has interacted with the field, for handling validation messages or styles
      shouldValidate: true,
    })
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    data.listingId = reservation?.listingId

    axios
      .post(`/api/review/${reservation?.id}`, data)
      .then(() => {
        toast.success('Listing reviewed', { duration: 5000 })
        reviewModal.onClose()
        router.refresh()
      })
      .catch((error) => {
        if (error.response?.data?.error) {
          toast.error(error.response.data.error, { duration: 5000 })
        } else {
          toast.error('Something went wrong', { duration: 5000 })
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <div className="flex items-center">
        <div className="aspect-square w-60 relative overflow-hidden rounded-xl">
          <Image
            alt="data"
            src={reservation?.listing.imageSrc[0]}
            fill
            className="object-cover h-50 w-50 group-hover:scale-110 transition select-none"
            sizes="( min-width: 640px) 640px, 100vw"
          />
        </div>
        <div className="ml-3 text-2xl text-black font-medium">
          <div>
            {reservation?.listing.title} in{' '}
            {reservation?.listing.city + ', ' + reservation?.listing.country}
          </div>
          {reservation?.listing.reviewCount == 0 ? (
            <span className="mt-2 text-xl font-medium leading-6 text-gray-900 flex items-center">
              <IoStar className="inline h-6 w-6 fill-current me-2" />
              No reviews (yet)
            </span>
          ) : (
            <div className="mt-2 text-xl font-medium leading-6 text-gray-900 flex items-center">
              <IoStar className="inline h-6 w-6 fill-current me-2" />
              <span>
                {reservation?.listing.averageRating.toFixed(2)} (
                {reservation?.listing.reviewCount} reviews)
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="relative py-6 mt-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
      </div>

      <TextArea
        id="review"
        label="Review (optional, up to 500 characters)"
        disabled={isLoading}
        register={register}
        errors={errors}
      />

      <div data-controller="rating">
        <StarRating
          value={cleanlinessRating}
          onChange={(value) => setCustomValue('cleanlinessRating', value)}
          disabled={isLoading}
          categoryRating="Cleanliness Rating"
        />
        <StarRating
          categoryRating="Accuracy Rating"
          value={accuracyRating}
          onChange={(value) => setCustomValue('accuracyRating', value)}
          disabled={isLoading}
        />
        <StarRating
          categoryRating="Check-in Rating"
          value={checkInRating}
          onChange={(value) => setCustomValue('checkInRating', value)}
          disabled={isLoading}
        />
        <StarRating
          categoryRating="Communication Rating"
          value={communicationRating}
          onChange={(value) => setCustomValue('communicationRating', value)}
          disabled={isLoading}
        />
        <StarRating
          categoryRating="Location Rating"
          value={locationRating}
          onChange={(value) => setCustomValue('locationRating', value)}
          disabled={isLoading}
        />
        <StarRating
          categoryRating="Value Rating"
          value={valueRating}
          onChange={(value) => setCustomValue('valueRating', value)}
          disabled={isLoading}
        />
      </div>
    </div>
  )

  const cancel = () => {
    reviewModal.onClose()
  }

  return (
    <Modal
      title={`Review your trip!`}
      isOpen={reviewModal.isOpen}
      onClose={reviewModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={'Submit Review'}
      secondaryActionLabel={'Cancel'}
      secondaryAction={cancel}
      body={bodyContent}
    />
  )
}

export default ReviewModal
