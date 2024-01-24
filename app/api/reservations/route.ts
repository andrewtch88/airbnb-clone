import { NextResponse } from 'next/server'

import prisma from '@/app/libs/prismadb'
import getCurrentUser from '@/app/actions/getCurrentUser'

// API to create a reservation
export async function POST(request: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json(
      { error: 'Please login to perform this action.' },
      { status: 400 }
    )
  }

  const body = await request.json()
  const { listingId, startDate, endDate, totalPrice } = body

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error()
  }

  const listingAndReservation = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      reservations: {
        // one to many relationship (one listing can have multiple reservations) (see schema)
        create: {
          // insert into reservations table
          userId: currentUser.id,
          startDate,
          endDate,
          totalPrice,
        },
      },
    },
  })

  return NextResponse.json(listingAndReservation)
}
