import prisma from '@/app/libs/prismadb'

export default async function getPayments() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        reservation: {
          include: {
            listing: {
              include: {
                user: true,
              },
            },
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // use map below as payments is a string[]
    // map is used to transform each element of array into a new form, such as formatting the dates
    const safePayments = payments.map((payment) => ({
      ...payment,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
      reservation: {
        ...payment.reservation,
        createdAt: payment.reservation.createdAt.toISOString(),
        startDate: payment.reservation.startDate.toISOString(),
        endDate: payment.reservation.endDate.toISOString(),
        listing: {
          ...payment.reservation.listing,
          createdAt: payment.reservation.listing.createdAt.toISOString(),
          updatedAt: payment.reservation.listing.updatedAt.toISOString(),
          user: {
            ...payment.reservation.listing.user,
            createdAt: payment.reservation.listing.user.createdAt.toISOString(),
            updatedAt: payment.reservation.listing.user.updatedAt.toISOString(),
            emailVerified:
              payment.reservation.listing.user.emailVerified?.toISOString() ||
              null,
          },
        },
        user: {
          ...payment.reservation.user,
          createdAt: payment.reservation.user.createdAt.toISOString(),
          updatedAt: payment.reservation.user.updatedAt.toISOString(),
          emailVerified:
            payment.reservation.user.emailVerified?.toISOString() || null,
        },
      },
    }))

    return safePayments
  } catch (error) {
    throw new Error(error)
  }
}
