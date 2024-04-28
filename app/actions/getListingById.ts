import prisma from '@/app/libs/prismadb'

interface IParams {
  listingId?: string
}

export default async function getListingById(params: IParams) {
  try {
    const { listingId } = params // url params: listingId?='abc123' or string

    if (!listingId) {
      throw new Error('Listing ID is missing')
    }

    const listing = await prisma?.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true,
        // review: true,
        reviews: {
          // reviews is in listing model (relation, one to many)
          include: {
            user: true, // Include the associated user for each review
          },
        },
      },
    })

    if (!listing) {
      console.log('Listing not found for ID:', listingId)
      return null
    }

    const overallRatingCounts = await prisma.review.groupBy({
      where: {
        listingId: listingId,
      },
      by: ['finalRating'],
      _count: {
        finalRating: true,
      },
    })

    const overallRatingCountsTransformed = overallRatingCounts.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.finalRating]: curr._count.finalRating,
      }),
      {}
    )

    const ratingCategoriesAvg = listing.reviews.reduce(
      (acc, review) => ({
        cleanlinessRating:
          acc.cleanlinessRating +
          review.cleanlinessRating / listing.reviews.length,
        accuracyRating:
          acc.accuracyRating + review.accuracyRating / listing.reviews.length,
        checkIn_Rating:
          acc.checkIn_Rating + review.checkIn_Rating / listing.reviews.length,
        communicationRating:
          acc.communicationRating +
          review.communicationRating / listing.reviews.length,
        locationRating:
          acc.locationRating + review.locationRating / listing.reviews.length,
        valueRating:
          acc.valueRating + review.valueRating / listing.reviews.length,
      }),
      {
        cleanlinessRating: 0,
        accuracyRating: 0,
        checkIn_Rating: 0,
        communicationRating: 0,
        locationRating: 0,
        valueRating: 0,
      }
    )

    return {
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt.toISOString(),
        updatedAt: listing.user.updatedAt.toISOString(),
        emailVerified: listing.user.emailVerified?.toISOString() || null,
      },
      reviews: listing.reviews.map((review) => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
      })),
      overallRatingCounts: overallRatingCountsTransformed,
      ratingCategoriesAvg,
    }
  } catch (error) {
    throw new Error(error)
  }
}
