import prisma from '@/app/libs/prismadb'

interface IParams {
  listingId?: string
}

function getListingById(id: string): Promise<any>
function getListingById(params: IParams): Promise<any>
async function getListingById(idOrParams: string | IParams) {
  try {
    let listingId: string | undefined

    if (typeof idOrParams === 'string') {
      listingId = idOrParams
    } else {
      listingId = idOrParams.listingId // url params listingId?='abc123'
    }

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true,
      }, // (includes user Model: true means all fields), no need to query multiple models multiple times
      // later used to get profile pic and user's name that owns the property listing
    })

    if (!listing) {
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

export default getListingById
