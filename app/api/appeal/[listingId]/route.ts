import getCurrentUser from '@/app/actions/getCurrentUser'
import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'

interface IParams {
  listingId?: string
}

export async function POST(request: Request, { params }: { params: IParams }) {
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

  if (!appealLetter) {
    return NextResponse.json(
      { error: 'Appeal letter is missing.' },
      { status: 400 }
    )
  }

  if (!userId) {
    return NextResponse.json({ error: 'User ID is missing.' }, { status: 400 })
  }

  const existingAppeal = await prisma.appeal.findUnique({
    where: {
      listingId,
    },
  })

  let appealData

  if (existingAppeal) {
    // Update the existing appeal
    appealData = await prisma.appeal.update({
      where: {
        id: existingAppeal.id,
      },
      data: {
        appealLetter,
        status: 'pending',
        updatedAt: new Date(),
      },
    })
  } else {
    // Create a new appeal
    appealData = await prisma.appeal.create({
      data: {
        userId,
        listingId,
        appealLetter,
        createdAt: new Date(),
      },
    })
  }

  return NextResponse.json(appealData)
}
