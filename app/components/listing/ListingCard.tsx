'use client'
import {
  safeListing,
  safeReserveNotification,
  safeReservation,
  SafeUser,
} from '@/app/types'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { format } from 'date-fns'
import Image from 'next/image'
import HeartButton from '../HeartButton'
import Button from '../Button'
import Avatar from '../Avatar'
import { IoStar } from 'react-icons/io5'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface ListingCardProps {
  data: safeListing
  reservation?: safeReservation
  onAction?: (id: string) => void
  disabled?: boolean // if disabled is true then disable the button
  actionLabel?: string //label for actionButton
  secondaryActionLabel?: string
  onSecondaryAction?: (id: string) => void
  actionId?: string // used with onAction to know e.g. deleteId
  currentUser?: SafeUser | null
  notifications?: safeReserveNotification | null
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionId = '',
  actionLabel,
  secondaryActionLabel,
  onSecondaryAction,
  currentUser,
  notifications,
}) => {
  const router = useRouter()

  const handleSecondaryAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()

      if (disabled) {
        return
      }

      onSecondaryAction?.(actionId)
    },
    [onSecondaryAction, disabled]
  )

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()

      if (disabled) {
        return
      }

      onAction?.(actionId)
    },
    [onAction, disabled]
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

  let overlayText = ''
  if (data.isSuspended) {
    if (data.appeal?.status === 'rejected') {
      overlayText = 'Appeal rejected, submit appeal again?'
    } else if (data.appeal?.status === 'pending') {
      overlayText = 'Appeal for suspension pending'
    } else {
      overlayText = 'Property suspended: Bad reviews and ratings'
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(data.address)
    toast.success('Address copied!')
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div
        onClick={
          data.isSuspended
            ? () => {}
            : () => router.push(`/listings/${data.id}`)
        }
        className="col-span-1 cursor-pointer group"
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="aspect-square w-full relative overflow-hidden rounded-xl">
            {actionLabel === 'Suspend property' ||
            actionLabel === 'View appeal' ? (
              <Link href={`/listings/${actionId}`} passHref>
                <Image
                  alt="data"
                  src={data.imageSrc[0]}
                  fill
                  className={`object-cover h-full w-full select-none ${
                    data.isSuspended ? '' : 'group-hover:scale-110 transition'
                  }`}
                  sizes="(min-width: 640px) 640px, 100vw"
                />
              </Link>
            ) : (
              <Image
                alt="data"
                src={data.imageSrc[0]}
                fill
                className={`object-cover h-full w-full select-none ${
                  data.isSuspended ? '' : 'group-hover:scale-110 transition'
                }`}
                sizes="(min-width: 640px) 640px, 100vw"
              />
            )}

            {/* Overlay Text (Suspension status or New reservation) */}
            {data.isSuspended ||
            (reservation &&
              notifications &&
              notifications?.newReservationIds.includes(reservation.id)) ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-center text-xl font-bold text-red-600 bg-white bg-opacity-80 px-4 py-2 rounded-md">
                  {data.isSuspended ? overlayText : 'New'}
                </span>
              </div>
            ) : (
              <div className="absolute top-3 right-3">
                <HeartButton listingId={data.id} currentUser={currentUser} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Listing Data */}
      <div className="flex justify-between">
        {reservation?.userId == currentUser?.id && currentUser ? (
          <div
            className="text-sm font-semibold flex flex-row items-center gap-2 cursor-copy"
            onClick={copyAddress}
          >
            {data.address}
          </div>
        ) : (
          <div className="font-semibold text-lg">
            {data.city + ', ' + data.country}
          </div>
        )}
        <p className="flex items-center text-md font-light">
          <IoStar className="mr-1 block w-4 h-4 fill-current" />
          {data.reviewCount > 0 ? `${data.averageRating.toFixed(2)}` : 'New'}
        </p>
      </div>

      {/* BOOKED BY */}
      {reservation?.userId == currentUser?.id ? (
        <></>
      ) : (
        reservation && (
          <>
            <div className="mt-5 text-sm font-semibold flex flex-row items-center gap-2">
              <div>Booked by {reservation.user.name}</div>
              {<Avatar src={reservation.user?.image} />}
            </div>
            <hr />
          </>
        )
      )}

      <div className="font-light text-neutral-500">
        {reservationDate || data.category}
      </div>
      <div className="flex flex-row items-center gap-1">
        <div className="font-semibold">RM{price}</div>

        {/* if is reservation then hide the per night, just display the price in above */}

        {!reservation && <div className="font-light">night</div>}
      </div>

      {/* BUTTON GROUP*/}
      <div className="flex flex-col gap-2 w-full">
        {onSecondaryAction && secondaryActionLabel && (
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
