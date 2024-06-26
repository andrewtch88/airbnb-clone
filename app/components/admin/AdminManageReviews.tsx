import Image from 'next/image'
import Link from 'next/link'
import { safeReview } from '../../types'
import ReviewItem from '../listing/ListingReviewItem'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Button from '../Button'
import Paginate from '../Paginate'

interface AdminManageReviewsProps {
  sortBy: string
  initialReviews: safeReview[]
}

const AdminManageReviews: React.FC<AdminManageReviewsProps> = ({
  sortBy,
  initialReviews,
}) => {
  const [reviews, setReviews] = useState(initialReviews)
  const [deletingId, setDeletingId] = useState('')
  const [disabled, setDisabled] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/admin/review?sortBy=${sortBy}`)
        setReviews(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        toast.error('Failed to fetch reviews')
      }
    }

    fetchData()
  }, [sortBy])

  const onDelete = useCallback(
    // id retrieve from key prop, that's why react force to use key prop
    (id: string) => {
      setDeletingId(id)
      setDisabled(true)

      axios
        .delete(`/api/admin/review/${id}`)
        .then(() => {
          toast.success('Deleted review.', { duration: 5000 })
          router.refresh()
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error)
        })
        .finally(() => {
          setDeletingId('')
          setDisabled(false)
        })
    },
    [router]
  )

  const handleCancel = useCallback(
    (reviewId: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (disabled) {
        return
      }
      onDelete?.(reviewId)
    },
    [onDelete, disabled]
  )

  const reviewItem = (review: safeReview) => (
    <div className="border border-gray-300 flex flex-col xl:flex-row gap-4 xl:gap-8 relative">
      <div className="group">
        <Link href={`/listings/${review?.listing?.id}`} passHref>
          <div className="aspect-square w-full h-60 xl:w-60 relative">
            <Image
              alt="data"
              src={review?.listing?.imageSrc[0] || '/images/placeholder.jpg'}
              fill
              className="object-cover h-50 w-50 group-hover:scale-110 transition select-none"
              sizes="(max-width: 60px) 60px, 60vw"
            />
          </div>
        </Link>
      </div>
      <div className="flex flex-col xl:flex-row xl:items-start">
        <ReviewItem review={review} />
        {/* BUTTON GROUP */}
        <div className="mt-4 xl:mt-0 xl:ml-auto">
          {handleCancel(review.id) && (
            <Button
              disabled={deletingId === review.id}
              small
              label={'Delete review'}
              onClick={(e) => handleCancel(review.id)(e)}
              className="px-4 py-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-80 transition"
            />
          )}
        </div>
      </div>
    </div>
  )

  return (
    <section
      aria-labelledby="reviews-items"
      className="border-t border-gray-200 pt-6 lg:pt-6"
    >
      <div className="space-y-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-8 lg:space-y-0 bg-white">
          {/* Show latest reviews first. */}
          <Paginate items={reviews} itemsPerPage={6} renderItem={reviewItem} />
        </div>
      </div>
    </section>
  )
}

export default AdminManageReviews
