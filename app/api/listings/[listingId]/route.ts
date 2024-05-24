import { NextRequest, NextResponse } from 'next/server'

import getCurrentUser from '@/app/actions/getCurrentUser'
import prisma from '@/app/libs/prismadb'
import getRegionByAddress from '@/app/hooks/useRegion'
import getCurrentAdmin from '@/app/actions/getCurrentAdmin'

import { useSearchParams } from 'next/navigation'

interface IParams {
  listingId?: string
  isAdmin?: boolean
}

export async function PUT(request: Request, { params }: { params: IParams }) {
  try {
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
      city,
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

    const country = getRegionByAddress(address)

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
        country: country,
        address,
        city,
        price: parseInt(price, 10),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedListing)
  } catch (error) {
    console.log('api/listings/[listingId] - PUT', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: IParams }
) {
  try {
    const { searchParams } = request.nextUrl
    const isAdmin = searchParams.get('isAdmin') === 'true'

    const { listingId } = params

    const getCurrentData = isAdmin ? getCurrentAdmin : getCurrentUser

    const verifyRole = await getCurrentData()
    if (!verifyRole) {
      return NextResponse.error()
    }

    if (!listingId || typeof listingId !== 'string') {
      throw new Error('Invalid ID')
    }

    const listing = await prisma?.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        appeal: true,
      },
    })

    return NextResponse.json(listing)
  } catch (error) {
    console.log('api/listings/[listingId] - GET', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
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
  } catch (error) {
    console.log('api/listings/[listingId] - DELETE', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
