import prisma from '@/app/libs/prismadb'

interface IParams {
  listingId: string
  reservationId: string
}

export default async function updateListingRating(params: IParams) {
  try {
    const { listingId, reservationId } = params // url params: listingId?='abc123' or string

    if (!listingId) {
      throw new Error('Listing ID is missing')
    }

    if (!reservationId) {
      throw new Error('Reservation ID is missing')
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        reviews: {
          // one to many relation (see types) then can include
          select: {
            finalRating: true, // finalRating sum of all reviews
          },
        },
      },
    })

    if (!listing) {
      throw new Error('Listing not found')
    }

    // reduce is used to iterate over array and perform calculation (must have initial value of sum (0) or error)
    // finalRatings are summed up and divided by total reviews
    const averageRating =
      listing.reviews.reduce((sum, review) => sum + review.finalRating, 0) /
      listing.reviews.length
    const reviewCount = listing.reviews.length

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        averageRating: averageRating,
        reviewCount: reviewCount,
      },
    })

    await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        hasReviewed: true,
      },
    })
  } catch (error) {
    // Check if error is an instance of Error and get the message
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    throw new Error(errorMessage)
  }
}
