import { NextResponse } from 'next/server'

import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/getCurrentUser'
import { updateListingRating } from '@/app/actions/refreshListingRating'

// API to create a review and also refresh the ratings of the listing
interface IParams {
  reservationId?: string
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Please login to perform this action.' },
        { status: 400 }
      )
    }

    const { reservationId } = params

    const body = await request.json()

    const {
      listingId,
      review,
      cleanlinessRating,
      accuracyRating,
      checkInRating,
      communicationRating,
      locationRating,
      valueRating,
    } = body

    if (
      !listingId ||
      !reservationId ||
      !cleanlinessRating ||
      !accuracyRating ||
      !checkInRating ||
      !communicationRating ||
      !locationRating ||
      !valueRating ||
      !review
    ) {
      return NextResponse.error()
    }

    if (review && review.length < 50) {
      return NextResponse.json(
        { error: 'Review must be at least 50 characters.' },
        { status: 400 }
      )
    }

    if (review && review.length > 500) {
      return NextResponse.json(
        { error: 'Review must be less than 500 characters.' },
        { status: 400 }
      )
    }

    const minRating = 1
    const ratings = [
      cleanlinessRating,
      accuracyRating,
      checkInRating,
      communicationRating,
      locationRating,
      valueRating,
    ]
    const hasInvalidRating = ratings.some((rating) => rating < minRating)
    if (hasInvalidRating) {
      return NextResponse.json(
        { error: 'Star ratings are required.' },
        { status: 400 }
      )
    }

    const totalPoints =
      cleanlinessRating +
      accuracyRating +
      checkInRating +
      communicationRating +
      locationRating +
      valueRating

    const finalRating = totalPoints / 6

    const reviewData = await prisma.review.create({
      data: {
        userId: currentUser.id,
        listingId: listingId,
        reservationId,
        review: review ? review : 'No review given.',
        cleanlinessRating,
        accuracyRating,
        checkIn_Rating: checkInRating,
        communicationRating,
        locationRating,
        valueRating,
        finalRating,
        createdAt: new Date(),
      },
    })

    await updateListingRating({
      listingId: listingId,
      reservationId: reservationId,
    })

    return NextResponse.json(reviewData)
  } catch (error) {
    console.log('api/review/[reservationId]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
