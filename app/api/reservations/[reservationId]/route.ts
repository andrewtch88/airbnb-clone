import { NextResponse } from 'next/server'

import getCurrentUser from '@/app/actions/getCurrentUser'
import prisma from '@/app/libs/prismadb'

// API to delete a reservation based on the reservation id or user
interface IParams {
  reservationId?: string
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

    const { reservationId } = params

    if (!reservationId || typeof reservationId !== 'string') {
      throw new Error('Invalid ID')
    }

    const reservation = await prisma.reservation.deleteMany({
      // arguments to filter which reservation to delete (deleteMany)
      where: {
        id: reservationId,
        // reservation creator or listing owner can delete the reservation (no need to query multiple models, easier to do in one API call)
        OR: [
          { userId: currentUser.id },
          { listing: { userId: currentUser.id } },
        ],
      },
    })

    return NextResponse.json(reservation)
  } catch (error) {
    console.log('api/reservations/[reservationId] - DELETE', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.error()
    }

    const { reservationId } = params

    if (!reservationId || typeof reservationId !== 'string') {
      throw new Error('Invalid ID')
    }

    const reservation = await prisma.reservation.findUnique({
      where: {
        id: reservationId,
      },
      include: {
        listing: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    })

    return NextResponse.json(reservation)
  } catch (error) {
    console.log('api/reservations/[reservationId] - GET', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
