import getCurrentUser from './getCurrentUser'
import prisma from '@/app/libs/prismadb'

export default async function getReserveNotification() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return []
    }

    const notifications = await prisma.reserveNotification.findMany({
      where: {
        userId: currentUser.id,
      },
    })

    const safeNotifications = notifications.map((notification) => ({
      ...notification,
      createdAt: notification.createdAt.toISOString(),
      updatedAt: notification.updatedAt.toISOString(),
    }))

    return safeNotifications
  } catch (error) {
    // Check if error is an instance of Error and get the message
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    throw new Error(errorMessage)
  }
}

export async function getInboxNotification() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return null
    }

    const notifications = await prisma.inboxNotification.findMany({
      where: {
        userId: currentUser.id,
      },
      include: {
        conversations: true,
      },
    })

    const inboxNotifications = notifications.flatMap((notification) =>
      notification.conversations.map((conversation) => ({
        conversationId: conversation.conversationId,
        unread: conversation.unread,
      }))
    )

    return inboxNotifications
  } catch (error) {
    // Check if error is an instance of Error and get the message
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    throw new Error(errorMessage)
  }
}
