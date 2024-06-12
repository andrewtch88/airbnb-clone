import prisma from '@/app/libs/prismadb'
import updateListingRating from '@/app/actions/refreshListingRating'

it('update listing averageRating & reviewCount and specific reservation to hasReviewed when valid listingId and reservationId are provided', async () => {
  const mockListing = {
    id: 'abc123',
    reviews: [{ finalRating: 4 }, { finalRating: 5 }],
  }
  const mockUpdatedListing = {
    averageRating: 4.5,
    reviewCount: 2,
  }
  const mockReservation = {
    id: 'res123',
    hasReviewed: true,
  }

  prisma.listing.findUnique = jest.fn().mockResolvedValue(mockListing)
  prisma.listing.update = jest.fn().mockResolvedValue(mockUpdatedListing)
  prisma.reservation.update = jest.fn().mockResolvedValue(mockReservation)

  await updateListingRating({ listingId: 'abc123', reservationId: 'res123' })

  expect(prisma.listing.findUnique).toHaveBeenCalledWith({
    where: { id: 'abc123' },
    include: {
      reviews: {
        select: {
          finalRating: true,
        },
      },
    },
  })
  expect(prisma.listing.update).toHaveBeenCalledWith({
    where: { id: 'abc123' },
    data: {
      averageRating: 4.5,
      reviewCount: 2,
    },
  })
  expect(prisma.reservation.update).toHaveBeenCalledWith({
    where: { id: 'res123' },
    data: {
      hasReviewed: true,
    },
  })
})
