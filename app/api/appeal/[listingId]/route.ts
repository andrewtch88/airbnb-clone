import getCurrentUser from '@/app/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

interface IParams {
  listingId?: string
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

    const { listingId } = params

    if (!listingId) {
      return NextResponse.json(
        { error: 'Listing ID is missing.' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const { userId, appealLetter } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is missing.' },
        { status: 400 }
      )
    }

    if (appealLetter === '') {
      return NextResponse.json(
        { error: 'Appeal letter is missing.' },
        { status: 400 }
      )
    }

    const createAppeal = await prisma.appeal.upsert({
      where: {
        listingId,
      },
      create: {
        userId,
        listingId,
        appealLetter,
        createdAt: new Date(),
      },
      update: {
        appealLetter,
        status: 'pending',
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(createAppeal)
  } catch (error) {
    console.log('api/appeal/[listingId]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
