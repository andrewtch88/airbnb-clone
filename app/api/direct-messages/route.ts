import { DirectMessage } from '@prisma/client'
import { NextResponse } from 'next/server'

import getCurrentUser from '@/app/actions/getCurrentUser'
import prisma from '@/app/libs/prismadb'

// Infinite fetch api, request 10 messages at a time (either is by scroll or button)
const MESSAGES_BATCH = 10

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser()
    const { searchParams } = new URL(req.url)

    const cursor = searchParams.get('cursor') // infinite loading based on cursor
    const conversationId = searchParams.get('conversationId')

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!conversationId) {
      return new NextResponse('Conversation ID missing', { status: 400 })
    }

    let messages: DirectMessage[] = []

    if (cursor) {
      messages = await prisma.directMessage.findMany({
        take: MESSAGES_BATCH, // 10 results at a time
        skip: 1, // Without skip: 1, the second query returns 10 results after (and including) the cursor
        cursor: {
          id: cursor, // start from the cursor
        },
        where: {
          conversationId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      messages = await prisma.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    let nextCursor: string | null = null

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    })
  } catch (error) {
    console.log('api/direct-messages', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
