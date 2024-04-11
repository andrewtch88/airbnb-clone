'use client'
import { safeListing, safeReservation, SafeUser } from '@/app/types'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { format } from 'date-fns'
import Image from 'next/image'
import HeartButton from '../HeartButton'
import Button from '../Button'
import Avatar from '../Avatar'

interface ListingCardProps {
  data: safeListing
  reservation?: safeReservation
  onAction?: (id: string) => void
  disabled?: boolean // if disabled is true then disable the button
  actionLabel?: string //label for actionButton
  secondaryActionLabel?: string
  secondaryAction?: () => void
  actionId?: string // used with onAction to know e.g. deleteId
  currentUser?: SafeUser | null
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionId = '',
  actionLabel,
  secondaryActionLabel,
  secondaryAction,
  currentUser,
}) => {
  const router = useRouter()

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return
    }

    secondaryAction()
  }, [disabled, secondaryAction])

  // handle the cancellation of an action associated with a listing card
  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()

      if (disabled) {
        return
      }
      onAction?.(actionId)
    },
    [onAction, actionId, disabled]
  )

  // useMemo returns a memoized value, while useCallback returns a memoized function
  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice
    }

    return data.price
  }, [reservation, data.price])

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null
    }

    const start = new Date(reservation.startDate)
    const end = new Date(reservation.endDate)

    return `${format(start, 'PP')} - ${format(end, 'PP')}`
  }, [reservation])

  return (
    <div className="flex flex-col gap-2 w-full">
      <div
        onClick={() => router.push(`/listings/${data.id}`)}
        className="col-span-1 cursor-pointer group"
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="aspect-square w-full relative overflow-hidden rounded-xl">
            <Image
              alt="data"
              src={data.imageSrc[0]}
              fill
              className="object-cover h-full w-full group-hover:scale-110 transition select-none"
              sizes="( min-width: 640px) 640px, 100vw"
            />
            <div className="absolute top-3 right-3">
              <HeartButton listingId={data.id} currentUser={currentUser} />
            </div>
          </div>
          <div className="font-semibold text-lg">{data.region}</div>

          {reservation && (
            <>
              <div className="text-sm font-semibold flex flex-row items-center gap-2">
                <div>Booked by {reservation.user.name}</div>
                {<Avatar src={reservation.user?.image} />}
              </div>
              <hr />
            </>
          )}

          <div className="font-light text-neutral-500">
            {reservationDate || data.category}
          </div>
          <div className="flex flex-row items-center gap-1">
            <div className="font-semibold">RM{price}</div>

            {/* if is reservation then hide the per night, just display the price in above */}

            {!reservation && <div className="font-light">night</div>}
          </div>
        </div>
      </div>

      {/* BUTTON GROUP*/}

      <div className="flex flex-col gap-2 w-full">
        {secondaryAction && secondaryActionLabel && (
          <Button
            outline
            disabled={disabled}
            label={secondaryActionLabel}
            onClick={handleSecondaryAction}
          />
        )}
        {/* need onAction function and actionLabel to display the action button */}
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  )
}

export default ListingCard
