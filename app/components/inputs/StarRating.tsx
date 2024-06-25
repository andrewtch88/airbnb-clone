'use client'

import React, { useCallback, useState } from 'react'

interface StarRatingProps {
  categoryRating: string
  value: number
  onChange?: (value: number) => void
  disabled?: boolean
}

const StarRating: React.FC<StarRatingProps> = ({
  categoryRating,
  value,
  onChange,
  disabled,
}) => {
  const [rating, setRating] = useState(value)
  const [hover, setHover] = useState<number | null>(null)

  const handleRatingChange = useCallback(
    (currentRating: number) => {
      if (disabled || !onChange) {
        return
      }
      setRating(currentRating)
      onChange(currentRating)
    },
    [onChange, disabled]
  )

  const renderStars = () => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          const currentRating = i + 1

          return (
            <label key={i} className="mr-2 sm:mr-4 last:mr-0">
              <input
                type="radio"
                name="rating"
                value={currentRating}
                onChange={() => handleRatingChange(currentRating)}
                disabled={disabled}
                className="hidden"
              />
              <span
                className={`text-2xl sm:text-3xl cursor-pointer ${
                  disabled ? 'opacity-30 cursor-not-allowed' : ''
                }`}
                style={{
                  color:
                    currentRating <= (hover || rating) ? '#ffc107' : '#e4e5e9',
                }}
                onMouseEnter={() => setHover(currentRating)}
                onMouseLeave={() => setHover(null)}
              >
                &#9733;
              </span>
            </label>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex justify-between py-4">
      <label
        htmlFor={categoryRating}
        className="text-sm font-medium leading-6 text-gray-900"
      >
        {categoryRating}
      </label>
      <div className="flex justify-center">
        <input
          type="hidden"
          name={categoryRating}
          value={rating?.toString() || ''}
        />
        {renderStars()}
      </div>
    </div>
  )
}

export default StarRating
