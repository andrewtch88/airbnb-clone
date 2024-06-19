import getCurrentUser from '@/app/actions/getCurrentUser'
import { ChatHeader } from '@/app/components/chat/chat-header'
import { ChatInput } from '@/app/components/chat/chat-input'
import { ChatMessages } from '@/app/components/chat/chat-messages'
import Container from '@/app/components/Container'
import EmptyState from '@/app/components/EmptyState'
import { getOrCreateConversation } from '@/app/libs/conversation'

interface IParams {
  memberId: string
}

const ConversationPage = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="Please login to chat with other users"
      />
    )
  }

  const conversation = await getOrCreateConversation(
    currentUser.id,
    params.memberId
  )

  if (!conversation) {
    return (
      <EmptyState
        title="Invalid Conversation"
        subtitle="Please try again later"
      />
    )
  }

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.id === currentUser.id ? memberTwo : memberOne

  return (
    <Container>
      <div className="bg-white flex flex-col h-full">
        <ChatHeader name={otherMember.name} imageUrl={otherMember.image} />
        <ChatMessages
          user={currentUser}
          name={otherMember.name}
          chatId={conversation.id}
          apiUrl="/api/direct-messages"
          paramKey="conversationId"
          paramValue={conversation.id}
        />
        <ChatInput
          name={otherMember.name}
          apiUrl="/api/socket/direct-messages"
          query={{
            conversationId: conversation.id,
            currentUserId: currentUser.id,
          }}
        />
      </div>
    </Container>
  )
}

export default ConversationPage
