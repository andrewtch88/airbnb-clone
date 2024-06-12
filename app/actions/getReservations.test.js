import prisma from '@/app/libs/prismadb'
import getReservations from '@/app/actions/getReservations'

// retrieves reservations by listingId
it('should retrieve reservations when listingId is provided', async () => {
  const mockReservations = [
    {
      id: '1',
      listingId: 'listing1',
      userId: 'user1',
      createdAt: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      listing: {
        id: 'listing1',
        createdAt: new Date(),
      },
      user: {
        id: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: new Date(),
      },
    },
  ]

  prisma.reservation.findMany = jest.fn().mockResolvedValue(mockReservations)

  const params = { listingId: 'listing1' }
  const result = await getReservations(params)

  expect(prisma.reservation.findMany).toHaveBeenCalledWith({
    where: { listingId: 'listing1' },
    include: { listing: true, user: true },
    orderBy: { createdAt: 'desc' },
  })
  expect(result).toHaveLength(1)
  expect(result[0].listingId).toBe('listing1')
})

// retrieves reservations by userId
it('should retrieve reservations when userId is provided', async () => {
  const mockReservations = [
    {
      id: '1',
      listingId: 'listing1',
      userId: 'user1',
      createdAt: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      listing: {
        id: 'listing1',
        createdAt: new Date(),
      },
      user: {
        id: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: new Date(),
      },
    },
  ]

  prisma.reservation.findMany = jest.fn().mockResolvedValue(mockReservations)

  const params = { userId: 'user1' }
  const result = await getReservations(params)

  expect(prisma.reservation.findMany).toHaveBeenCalledWith({
    where: { userId: 'user1' },
    include: { listing: true, user: true },
    orderBy: { createdAt: 'desc' },
  })
  expect(result).toHaveLength(1)
  expect(result[0].userId).toBe('user1')
})

// fetch reservations by ownerId
it('should fetch reservations when ownerId is provided', async () => {
  const mockReservations = [
    {
      id: '1',
      listingId: 'listing1',
      userId: 'user1',
      createdAt: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      listing: {
        id: 'listing1',
        createdAt: new Date(),
      },
      user: {
        id: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: new Date(),
      },
    },
  ]

  prisma.reservation.findMany = jest.fn().mockResolvedValue(mockReservations)

  const params = { ownerId: 'user1' }
  const result = await getReservations(params)

  expect(prisma.reservation.findMany).toHaveBeenCalledWith({
    where: { listing: { userId: 'user1' } },
    include: { listing: true, user: true },
    orderBy: { createdAt: 'desc' },
  })
  expect(result).toHaveLength(1)
  expect(result[0].userId).toBe('user1')
})
