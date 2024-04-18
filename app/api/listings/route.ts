import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/getCurrentUser'
import getRegionByAddress from '@/app/hooks/useRegion'

// API to post a property listing
export async function POST(request: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.error()
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

  if (category === '') {
    return NextResponse.json(
      { error: 'Please select a category at the first page.' },
      { status: 400 }
    )
  }

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

  const listing = await prisma.listing.create({
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
      userId: currentUser.id,
    },
  })

  return NextResponse.json(listing)
}
