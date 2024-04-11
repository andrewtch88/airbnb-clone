'use client'
import React from 'react'
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form'

interface TextAreaProps {
  id: string
  label: string
  type?: string
  disabled?: boolean
  required?: boolean
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
  value?: string[]
  onChange?: (value: string[]) => void
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  disabled,
  required,
  register,
  errors,
  value = [],
  onChange,
}) => {
  const [text, setText] = React.useState<string>(value.join('\n'))

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    setText(value)
    onChange?.(value.split('\n'))
  }

  return (
    <div className="w-full relative">
      <textarea
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=" "
        className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md 
          outline-none transition disabled:opacity-70 disabled:cursor-not-allowed 
          ${errors[id] ? 'border-rose-500' : 'border-neutral-300'}
          ${errors[id] ? 'focus:border-rose-500' : 'focus:border-black'}
        `}
        value={text}
        onChange={handleChange} // Keep this one
      />
      <label
        htmlFor={id}
        className={`absolute text-md duration-150 transform -translate-y-3 top-5 left-4 z-10 origin-[0] 
          ${errors[id] ? 'text-rose-500' : 'text-zinc-400'}
        `}
      >
        {label}
      </label>
    </div>
  )
}

export default TextArea
