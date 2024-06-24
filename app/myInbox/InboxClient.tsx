// to display lists of conversations
import { Conversation, User } from '@prisma/client'
import React from 'react'
import Container from '../components/Container'
import Heading from '../components/Heading'
import ConversationPreview from '../components/chat/Conversation'
import { safeInboxNotification } from '../types'

interface InboxClientProps {
  conversations: Conversation[]
  currentUser: User
  inboxNotifications?: safeInboxNotification | null
}

const InboxClient: React.FC<InboxClientProps> = ({
  conversations,
  currentUser,
  inboxNotifications,
}) => {
  return (
    <Container>
      <Heading title="Inbox" subtitle="List of your conversations" />
      {conversations.map((conversation) => {
        return (
          <ConversationPreview
            key={conversation.id}
            conversationId={conversation.id}
            currentUser={currentUser}
            notifications={inboxNotifications}
          />
        )
      })}
    </Container>
  )
}

export default InboxClient
