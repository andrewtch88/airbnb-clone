import getCurrentAdmin from '@/app/actions/getCurrentAdmin'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

interface IParams {
  reviewId?: string
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const currentAdmin = await getCurrentAdmin()

    if (!currentAdmin) {
      return NextResponse.error()
    }

    const { reviewId } = params

    if (!reviewId || typeof reviewId !== 'string') {
      throw new Error('Invalid ID')
    }

    const review = await prisma?.review.deleteMany({
      where: {
        id: reviewId,
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.log('api/admin/review/[reviewId]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
