import prisma from '@/app/libs/prismadb'

export default async function getReviews() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: true,
        listing: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const safeReviews = reviews.map((review) => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
      user: {
        ...review.user,
        createdAt: review.user.createdAt.toISOString(),
        updatedAt: review.user.updatedAt.toISOString(),
        emailVerified: review.user.emailVerified?.toISOString() || null,
      },
      listing: {
        ...review.listing,
        createdAt: review.listing.createdAt.toISOString(),
      },
    }))

    return safeReviews
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    throw new Error(errorMessage)
  }
}
