import prisma from '@/app/libs/prismadb'

// Retrieves all listings from DB using server component (no 'use client') and Prisma, flexible as it can display home screen or owner listings screen

export interface IListingsParams {
  userId?: string
  guestCount?: number
  roomCount?: number
  bathroomCount?: number
  startDate?: string
  endDate?: string
  region?: string
  address?: string
  category?: string
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      region,
      startDate,
      endDate,
      category,
      address,
    } = params

    let query: any = {}

    if (userId) {
      query.userId = userId
    }

    if (category) {
      query.category = category
    }

    if (roomCount) {
      query.roomCount = {
        gte: +roomCount, // gte = greater than or equal
      }
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      }
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount, // bathroomCount: { gte: 2 }
      }
    }

    if (address) {
      query.address = {
        contains: address, // Case-insensitive search
      }
    }

    if (region) {
      query.region = {
        contains: region,
      }
    }

    // [ { endDate: [Object], startDate: [Object] }, { startDate: [Object], endDate: [Object] } ]

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      }
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const safeListing = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }))

    return safeListing
  } catch (error) {
    throw new Error(typeof error === 'string' ? error : String(error))
  }
}
