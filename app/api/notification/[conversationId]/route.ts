import { NextResponse } from 'next/server'

import getCurrentUser from '@/app/actions/getCurrentUser'
import prisma from '@/app/libs/prismadb'

interface IParams {
  conversationId?: string
}

export async function PUT(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.error()
    }

    const { conversationId } = params

    const inboxNotification = await prisma.inboxNotification.findUnique({
      where: {
        userId: currentUser.id,
      },
    })

    const markAsRead = await prisma.$transaction(async (prisma) => {
      // First, fetch the current conversation notification
      const currentNotification = await prisma.conversationNotification.findUnique(
        {
          where: {
            inboxNotificationId: inboxNotification?.id,
          },
          select: {
            conversationIds: true,
          },
        }
      )

      // Filter out the conversationId
      const updatedConversationIds = currentNotification?.conversationIds.filter(
        (id) => id !== conversationId
      )

      // Update with the new array
      return await prisma.conversationNotification.update({
        where: {
          inboxNotificationId: inboxNotification?.id,
        },
        data: {
          conversationIds: updatedConversationIds,
        },
      })
    })

    return NextResponse.json(markAsRead)
  } catch (error) {
    console.log('api/notification', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
