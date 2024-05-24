import prisma from '@/app/libs/prismadb'
import { europeanCountries } from '../hooks/useRegion'
// Retrieves all listings from DB using server component (no 'use client') and Prisma, flexible as it can display home screen or owner listings screen

export interface IListingsParams {
  userId?: string
  guestCount?: number
  roomCount?: number
  bathroomCount?: number
  startDate?: string
  endDate?: string
  country?: string
  address?: string
  category?: string
  allProperties?: boolean
  onAppeal?: boolean
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      country,
      startDate,
      endDate,
      category,
      address,
      allProperties,
      onAppeal,
    } = params

    let query: any = {}

    if (!allProperties) {
      query.isSuspended = false
    }

    if (onAppeal) {
      query.appeal = { status: 'pending' }
      query.isSuspended = true
    }

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
        mode: 'insensitive',
      }
    }

    if (country) {
      if (country == 'Europe') {
        query.country = {
          in: europeanCountries,
        }
      } else {
        query.country = country
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
      include: {
        appeal: true,
      },
      where: query,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
      appeal: listing.appeal
        ? {
            ...listing.appeal,
            createdAt: listing.appeal.createdAt.toISOString(),
            updatedAt: listing.appeal.updatedAt.toISOString(),
          }
        : null,
    }))

    return safeListings
  } catch (error) {
    throw new Error(error)
  }
}
