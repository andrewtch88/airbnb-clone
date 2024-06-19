'use client'

import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import axios from 'axios'
import qs from 'query-string'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Input from '../inputs/Input'

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="fixed bottom-0 w-full bg-white"
    >
      <div className="relative p-4 pb-6">
        <Input
          id="content"
          label={`Message ${name}`}
          className="px-14 py-6 bg-zinc-200/90 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />

        <button
          disabled={isLoading}
          type="submit"
          className="relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full"
        >
          Send
        </button>
      </div>
    </form>
  )
}
