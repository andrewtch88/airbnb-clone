import getCurrentAdmin from '@/app/actions/getCurrentAdmin'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import { safeReview } from '@/app/types'

export async function GET(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin()

    if (!currentAdmin) {
      return NextResponse.error()
    }

    const url = new URL(request.url)
    const sortBy = url.searchParams.get('sortBy')

    let query: any = {}

    if (sortBy === 'newest') {
      query = { createdAt: 'desc' }
    } else if (sortBy === 'finalRating asc') {
      query = { finalRating: 'asc' }
    } else if (sortBy === 'finalRating desc') {
      query = { finalRating: 'desc' }
    } else if (sortBy !== null) {
      throw new Error('Invalid Sort By Selection')
    }

    const reviews = await prisma.review.findMany({
      include: {
        user: true,
        listing: true,
      },
      orderBy: query,
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

    return NextResponse.json(safeReviews as safeReview[])
  } catch (error) {
    console.log('api/admin/review', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
