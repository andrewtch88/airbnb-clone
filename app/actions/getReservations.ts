import prisma from '@/app/libs/prismadb'

// to get reservations on selected page based on listingId / tenantId / ownerId param
interface IParams {
  listingId?: string // use at listingClient
  userId?: string // use at my trips
  ownerId?: string // use at my reservations
}

export default async function getReservations(params: IParams) {
  try {
    const { listingId, userId, ownerId } = params

    // if query
    const query: any = {}

    if (listingId) {
      query.listingId = listingId
    }

    if (userId) {
      query.userId = userId
    }

    if (ownerId) {
      query.listing = { userId: ownerId }
    }

    // string[]
    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true, // includes listing Model all fields, no need query 2 times
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // use map below as reservations is a string[]
    // map is used to transform each element of array into a new form, such as formatting the dates
    const safeReservations = reservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt.toISOString(),
      },
      user: {
        // later can use reservation.user.name to get user name, is like joining tables with the help of include above
        // then sanitize the strings in the app\types\index.ts and export the model types to initialize the models in the props of the components interface
        ...reservation.user,
        createdAt: reservation.user.createdAt.toISOString(),
        updatedAt: reservation.user.updatedAt.toISOString(),
        emailVerified: reservation.user.emailVerified?.toISOString() || null,
      },
    }))

    return safeReservations
  } catch (error) {
    throw new Error(error)
  }
}
