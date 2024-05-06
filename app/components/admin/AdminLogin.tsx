'use client'
import { signIn } from 'next-auth/react'
import { useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Heading from '../Heading'
import Input from '../inputs/Input'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Button from '../Button'

const AdminLoginModal = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register, // to register the input field for validation and state tracking
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    signIn('credentials', {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false)

      if (callback?.ok) {
        toast.success('Logged in', { duration: 5000 })
        router.refresh()
      }

      if (callback?.error) {
        toast.error(callback.error)
      }
    })
  }

  const bodyContent = (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-6">
      <Heading
        title="Welcome back, Admin"
        subtitle="Login to your admin account!"
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        type="password"
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <div className="mt-6">
        <Button
          disabled={isLoading}
          label={'Continue'}
          outline
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  )

  return bodyContent
}

export default AdminLoginModal
