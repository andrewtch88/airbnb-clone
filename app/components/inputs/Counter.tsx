'use client'

import { useCallback } from 'react'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'

// a component that does counting with buttons

interface CounterProps {
  title: string
  subtitle: string
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

const Counter: React.FC<CounterProps> = ({
  title,
  subtitle,
  value,
  onChange,
  disabled,
}) => {
  const onAdd = useCallback(() => {
    if (disabled) {
      return
    }

    onChange(value + 1)
  }, [onChange, value, disabled])

  const onMinus = useCallback(() => {
    if (disabled || value === 1) {
      return
    }

    onChange(value - 1)
  }, [onChange, value, disabled])

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <div className="font-medium">{title}</div>
        <div className="font-light text-gray-600">{subtitle}</div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div
          onClick={onMinus}
          className={`w-10 h-10 rounded-full border-[1px] border-neutral-400 flex items-center 
            justify-center text-neutral-600 cursor-pointer hover:opacity-80 transition 
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <AiOutlineMinus />
        </div>
        <div
          className={`font-light text-xl text-neutral-600 select-none
          ${disabled ? 'opacity-50' : ''}`}
        >
          {value}
        </div>
        <div
          onClick={onAdd}
          className={`w-10 h-10 rounded-full border-[1px] border-neutral-400 flex items-center 
            justify-center text-neutral-600 cursor-pointer hover:opacity-80 transition 
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <AiOutlinePlus />
        </div>
      </div>
    </div>
  )
}

export default Counter
