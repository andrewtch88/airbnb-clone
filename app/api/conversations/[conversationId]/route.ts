import getCurrentUser from '@/app/actions/getCurrentUser'
import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'

interface IParams {
  conversationId?: string
}

// Get other user from conversation
export async function GET(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { conversationId } = params

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ memberOneId: currentUser.id }, { memberTwoId: currentUser.id }],
      },
      include: {
        memberOne: true,
        memberTwo: true,
      },
    })

    if (!conversation) {
      throw new Error(
        'Conversation not found or user not a member of the conversation'
      )
    }

    const otherUser =
      conversation.memberOneId === currentUser.id
        ? conversation.memberTwo
        : conversation.memberOne

    return NextResponse.json(otherUser)
  } catch (error) {
    console.log('api/conversations', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
