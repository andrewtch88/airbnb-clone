import prisma from '@/app/libs/prismadb'

interface IParams {
  listingId?: string
}

export default async function getListingById(params: IParams) {
  try {
    const { listingId } = params // url params: listingId?='abc123' or string

    if (!listingId) {
      throw new Error('Listing ID is missing')
    }

    const listing = await prisma?.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true, // (includes user Model: true means all fields), no need to query multiple models multiple times
        // later used to get profile pic and user's name that owns the property listing
      },
    })

    console.log('Fetched listing:', listing)

    if (!listing) {
      console.log('Listing not found for ID:', listingId)
      return null
    }

    return {
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt.toISOString(),
        updatedAt: listing.user.updatedAt.toISOString(),
        emailVerified: listing.user.emailVerified?.toISOString() || null,
      },
    }
  } catch (error) {
    throw new Error(error)
  }
}
