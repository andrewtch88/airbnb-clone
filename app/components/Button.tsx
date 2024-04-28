'use client'
import React from 'react'
import { IconType } from 'react-icons'

// typescript prop interface for safely typing
interface ButtonProps {
  className?: string
  label?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  outline?: boolean // outline appearance
  small?: boolean // small button
  icon?: IconType
}

const Button: React.FC<ButtonProps> = ({
  className,
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
}) => {
  const buttonClassNames = `${
    className ||
    'relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full'
  } ${outline ? 'bg-white' : 'bg-rose-500'} ${
    outline ? 'border-black' : 'border-rose-500'
  } ${outline ? 'text-black' : 'text-white'} ${small ? 'py-1' : 'py-3'} ${
    small ? 'text-sm' : 'text-md'
  } ${small ? 'font-light' : 'font-semibold'} ${
    small ? 'border-[1px]' : 'border-2'
  }`

  return (
    <button onClick={onClick} disabled={disabled} className={buttonClassNames}>
      {Icon && <Icon size={24} className="absolute left-4 top-3" />}
      {label}
    </button>
  )
}

export default Button
