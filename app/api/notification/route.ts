import { NextResponse } from 'next/server'

import getCurrentUser from '@/app/actions/getCurrentUser'
import prisma from '@/app/libs/prismadb'
import getReserveNotification from '@/app/actions/getNotifications'

export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.error()
    }

    const markAsRead = await prisma.reserveNotification.updateMany({
      where: {
        userId: currentUser.id,
      },
      data: {
        unreadCount: 0,
        newReservationIds: [],
      },
    })

    return NextResponse.json(markAsRead)
  } catch (error) {
    console.log('api/notification', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
