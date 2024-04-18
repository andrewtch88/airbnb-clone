import { NextResponse } from 'next/server'

import getCurrentUser from '@/app/actions/getCurrentUser'
import prisma from '@/app/libs/prismadb'
import getRegionByAddress from '@/app/hooks/useRegion'

interface IParams {
  listingId?: string
}

export async function PUT(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.error()
  }

  const { listingId } = params

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID')
  }

  const body = await request.json()

  const {
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    address,
    price,
  } = body

  if (imageSrc === '') {
    return NextResponse.json(
      { error: 'Please include an image for your property.' },
      { status: 400 }
    )
  }

  if (imageSrc.length < 3) {
    return NextResponse.json(
      { error: 'Please include at least 3 images for your property.' },
      { status: 400 }
    )
  }

  const region = getRegionByAddress(address)

  let updatedListing = await prisma?.listing.update({
    where: {
      id: listingId,
      userId: currentUser.id,
    },
    data: {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      region: region,
      address,
      price: parseInt(price, 10),
    },
  })

  return NextResponse.json(updatedListing)
}

export async function GET(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.error()
  }

  const { listingId } = params

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID')
  }

  const listing = await prisma?.listing.findUnique({
    where: {
      id: listingId,
    },
  })

  return NextResponse.json(listing)
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.error()
  }

  const { listingId } = params

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID')
  }

  const listing = await prisma?.listing.deleteMany({
    where: {
      id: listingId,
      userId: currentUser.id,
    },
  })

  return NextResponse.json(listing)
}
