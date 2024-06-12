import getCurrentUser from './getCurrentUser'
import prisma from '@/app/libs/prismadb'

export default async function getNotifications() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return []
    }

    const notifications = await prisma.notification.findMany({
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
