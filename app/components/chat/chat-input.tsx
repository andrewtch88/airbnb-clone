'use client'

import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import axios from 'axios'
import qs from 'query-string'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Input from '../inputs/Input'
import { AiOutlineSend } from 'react-icons/ai'

interface ChatInputProps {
  apiUrl: string
  query: { [key: string]: string }
  name: string | null
}

export const ChatInput: React.FC<ChatInputProps> = ({
  apiUrl,
  query,
  name,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }, // to control form errors required
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      content: '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true)

      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      })

      await axios.post(url, data)

      reset()
      router.refresh()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="fixed bottom-0 inset-x-0 bg-white px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse sm:justify-between md:mr-10 inline-flex">
        <Input
          id="content"
          label={`Message ${name}`}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />

        <button
          disabled={isLoading}
          type="submit"
          className="disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition bg-rose-500 text-white 
            font-semibold text-lg py-2 px-4 md:ml-10 md:mr-5"
        >
          <AiOutlineSend size={24} />
        </button>
      </div>
    </form>
  )
}
