import { NextResponse } from 'next/server'
import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/getCurrentUser'
import getRegionByAddress from '@/app/hooks/useRegion'

export async function GET(request: Request) {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        reservations: true,
      },
      where: {
        isSuspended: false,
      },
    })

    const countryReservationsCount = listings.reduce(
      (acc: { [key: string]: number }, listing) => {
        const country = listing.country
        const reservationsCount = listing.reservations.length

        if (!acc[country]) {
          acc[country] = 0
        }
        acc[country] += reservationsCount

        return acc
      },
      {}
    )

    const popularListingsByCountry = Object.entries(countryReservationsCount)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)

    return NextResponse.json(popularListingsByCountry)
  } catch (error) {
    console.log('api/listings - GET', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

// API to post a property listing
export async function POST(request: Request) {
  try {
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
      city,
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

    const country = getRegionByAddress(address)

    const listing = await prisma.listing.create({
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
        userId: currentUser.id,
      },
    })

    return NextResponse.json(listing)
  } catch (error) {
    console.log('api/listings - POST', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
