import getCurrentUser from './getCurrentUser'
import prisma from '@/app/libs/prismadb'

export default async function getReserveNotification() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return []
    }

    const notifications = await prisma.reserveNotification.findUnique({
      where: {
        userId: currentUser.id,
      },
    })

    return notifications
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

    const notifications = await prisma.inboxNotification.findUnique({
      where: {
        userId: currentUser.id,
      },
      include: {
        conversations: true,
      },
    })

    return notifications
  } catch (error) {
    // Check if error is an instance of Error and get the message
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    throw new Error(errorMessage)
  }
}
