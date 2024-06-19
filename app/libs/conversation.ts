import prisma from '@/app/libs/prismadb'

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId))

  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId)
  }

  return conversation
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await prisma.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: true, // This includes the related User model for memberOne
        memberTwo: true,
      },
    })
  } catch {
    return null // returns null instead of catching error to keep the app running
  }
}

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    const conversation = await prisma.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: true, // This includes the related User model for memberOne
        memberTwo: true,
      },
    })

    return conversation
  } catch {
    return null
  }
}
