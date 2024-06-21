// to display lists of conversations
import { Conversation, User } from '@prisma/client'
import React from 'react'
import Container from '../components/Container'
import Heading from '../components/Heading'
import ConversationPreview from '../components/chat/Conversation'

interface InboxClientProps {
  conversations: Conversation[]
  currentUser: User
}

const InboxClient: React.FC<InboxClientProps> = ({
  conversations,
  currentUser,
}) => {
  return (
    <Container>
      <Heading title="Inbox" subtitle="List of your conversations" />
      {conversations.map((conversation) => {
        return (
          <ConversationPreview
            key={conversation.id}
            conversation={conversation}
            currentUser={currentUser}
          />
        )
      })}
    </Container>
  )
}

export default InboxClient
