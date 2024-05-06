'use client'

import useAppealModal from '@/app/hooks/useAppealModal'
import { safeListing } from '@/app/types'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import TextArea from '../inputs/TextArea'
import Image from 'next/image'
import { IoStar } from 'react-icons/io5'
import Modal from './Modal'
import Heading from '../Heading'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'

interface AppealModalProps {
  listing: safeListing | null
}

const AppealModal: React.FC<AppealModalProps> = ({ listing }) => {
  const appealModal = useAppealModal()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }, // to control form errors required
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      appealLetter: '',
    },
  })

  useEffect(() => {
    if (!appealModal.isOpen) {
      reset()
    }
  }, [appealModal.isOpen, reset])

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    data.userId = listing?.userId

    axios
      .post(`/api/appeal/${listing?.id}`, data)
      .then(() => {
        toast.success('Appeal sent')
        appealModal.onClose()
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
          <div className="group">
            <Link href={`/listings/${listing?.id}`} passHref>
              <Image
                alt="data"
                src={listing?.imageSrc[0]}
                fill
                className="object-cover h-50 w-50 group-hover:scale-110 transition select-none"
                sizes="( min-width: 640px) 640px, 100vw"
              />
            </Link>
          </div>
        </div>
        <div className="ml-3 text-2xl text-black font-medium">
          <div>
            {listing?.title} in {listing?.region}
          </div>
          <div className="mt-2 text-xl font-medium leading-6 text-gray-900 flex items-center">
            <IoStar className="inline h-6 w-6 fill-current me-2" />
            <span>
              {listing?.averageRating.toFixed(2)} ({listing?.reviewCount}{' '}
              reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="relative py-6 mt-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
      </div>

      <Heading
        title="Appeal form"
        subtitle="Review the customer feedbacks carefully (by navigating to the image above) 
          and outline how you plan to address the issues raised to improve your service."
      />

      <TextArea
        id="appealLetter"
        label="Write appeal here"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  )

  const cancel = () => {
    appealModal.onClose()
  }

  return (
    <Modal
      title={`Appeal form`}
      isOpen={appealModal.isOpen}
      onClose={appealModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={'Submit Appeal'}
      secondaryActionLabel={'Cancel'}
      secondaryAction={cancel}
      body={bodyContent}
    />
  )
}

export default AppealModal
