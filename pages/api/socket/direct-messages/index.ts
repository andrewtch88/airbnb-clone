import { NextApiRequest } from 'next'

import prisma from '@/app/libs/prismadb'
import { NextApiResponseServerIO } from '@/types'

// create a new direct message and notify other user
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { content } = req.body
    const conversationId = req.query.conversationId as string
    const currentUserId = req.query.currentUserId as string
    const otherUserId = req.query.otherUserId as string

    if (!currentUserId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID missing' })
    }

    if (!otherUserId) {
      return res.status(400).json({ error: 'Other user ID missing' })
    }

    if (!content) {
      return res.status(400).json({ error: 'Content missing' })
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              id: currentUserId,
            },
          },
          {
            memberTwo: {
              id: currentUserId,
            },
          },
        ],
      },
      include: {
        memberOne: true, // This includes the related User model for memberOne
        memberTwo: true,
      },
    })

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' })
    }

    const member =
      conversation.memberOne.id === currentUserId
        ? conversation.memberOne
        : conversation.memberTwo

    if (!member) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const message = await prisma.directMessage.create({
      data: {
        content,
        conversationId: conversationId as string,
        userId: member.id,
      },
      include: {
        user: true,
      },
    })

    const channelKey = `chat:${conversationId}:messages` //  ensures that messages are emitted to the correct Socket.IO channel.

    res?.socket?.server?.io?.emit(channelKey, message) // used in client to watch for new messages using hooks

    /* START upsert notification to other user */
    // Start a transaction to ensure atomic operations
    await prisma.$transaction(async (prisma) => {
      // Find or create the inbox notification
      const inboxNotification = await prisma.inboxNotification.upsert({
        where: { userId: otherUserId },
        update: {},
        create: { userId: otherUserId },
      })

      // Find the conversation notification
      let conversationNotification = await prisma.conversationNotification.findUnique(
        {
          where: {
            inboxNotificationId: inboxNotification.id,
          },
        }
      )

      if (conversationNotification) {
        // Update only if unread is false
        if (
          !conversationNotification?.conversationIds?.includes(conversationId)
        ) {
          await prisma.conversationNotification.update({
            where: {
              id: conversationNotification.id,
            },
            data: {
              conversationIds: {
                push: conversationId,
              },
            },
          })
        }
      } else {
        // Create new conversation notification
        await prisma.conversationNotification.create({
          data: {
            inboxNotificationId: inboxNotification.id,
            conversationIds: [conversationId],
          },
        })
      }
    })
    /* END upsert notification to other user */

    return res.status(200).json(message)
  } catch (error) {
    console.log('pages/api/socket/direct-messages', error)
    return res.status(500).json({ message: 'Internal Error' })
  }
}
