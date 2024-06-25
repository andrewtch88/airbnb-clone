'use client'

import { useEffect, useState } from 'react'
import { Range } from 'react-date-range'
import toast from 'react-hot-toast'
import Button from '../Button'
import Calendar from '../inputs/Calendar'

// listing reservation UI component (calendar at the listing page)
interface ListingReservationProps {
  price: number
  totalPrice: number
  onChangeDateRange: (value: Range) => void
  dateRange: Range
  onSubmit: () => void
  disabled?: boolean
  disabledDates: Date[]
  isOwner: boolean
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  totalPrice,
  onChangeDateRange,
  onSubmit,
  disabled,
  disabledDates,
  dateRange,
  isOwner,
}) => {
  const handleOnSubmit = () => {
    if (totalPrice === 0) {
      toast.error('Select dates to reserve!')
    } else {
      onSubmit()
    }
  }

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center justify-center gap-1 p-4">
        <div className="text-2xl font-semibold">RM{price}</div>
        <div className="font-light text-neutral-600">night</div>
      </div>
      <hr />
      <div className="flex flex-row items-center justify-center gap-1">
        <Calendar
          value={dateRange}
          disabledDates={disabledDates}
          onChange={(value) => onChangeDateRange(value.selection)}
        />
      </div>
      <hr />
      {totalPrice !== 0 && (
        <>
          <div className="p-4 flex flex-reverse justify-end font-semibold text-lg">
            <div> Total: RM{totalPrice} </div>
          </div>
          <hr />
        </>
      )}
      <div className="p-4">
        {isOwner ? (
          <Button disabled={true} label="Hi owner, checking the calendar?" />
        ) : (
          <div className="items-center gap-4">
            <p className="font-light text-neutral-600 mb-4 text-center text-sm">
              You won&apos;t be charged yet
            </p>
            <Button
              disabled={disabled}
              label="Reserve"
              onClick={handleOnSubmit}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ListingReservation
