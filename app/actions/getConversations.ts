import getCurrentUser from './getCurrentUser'
import prisma from '@/app/libs/prismadb'

export default async function hasConversation() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return []
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        AND: [
          {
            OR: [
              { memberOneId: currentUser.id },
              { memberTwoId: currentUser.id },
            ],
          },
          {
            directMessages: {
              some: {},
            },
          },
        ],
      },
    })

    return conversations
  } catch (error) {
    // Check if error is an instance of Error and get the message
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    throw new Error(errorMessage)
  }
}
