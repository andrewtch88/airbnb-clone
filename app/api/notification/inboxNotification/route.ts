import getCurrentUser from '@/app/actions/getCurrentUser'
import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return null
    }

    const notifications = await prisma.inboxNotification.findUnique({
      where: {
        userId: currentUser.id,
      },
      include: {
        conversations: true,
      },
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.log('api/notification/inboxNotification', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
