import getCurrentUser from '@/app/actions/getCurrentUser'
import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return []
    }

    const notifications = await prisma.reserveNotification.findMany({
      take: 1,
      where: {
        userId: currentUser.id,
      },
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.log('api/notification/reserveNotification', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
