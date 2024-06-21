'use client'

import { useRouter } from 'next/navigation'
import { Conversation, User, DirectMessage } from '@prisma/client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Avatar from '../Avatar'
import { useChatQuery } from '@/app/hooks/use-chat-query'
import { formatDistanceToNow } from 'date-fns'

type MessageWithMember = DirectMessage & {
  user: User // access user Model from DirectMessage (relation)
}

interface ConversationProps {
  conversation: Conversation
  currentUser: User
}

const ConversationPreview: React.FC<ConversationProps> = ({
  conversation,
  currentUser,
}) => {
  const router = useRouter()

  const [otherUser, setOtherUser] = useState<User | null>(null)
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/conversations/${conversation.id}`)
      setOtherUser(response.data)
    }

    fetchData()
  }, [conversation.id])

  const queryKey = `chat:${conversation.id}`
  const apiUrl = `/api/direct-messages`
  const paramKey = 'conversationId'
  const paramValue = conversation.id

  const { data } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  })

  // messageWithMember type
  const latestMessagePreview = data?.pages?.[0]?.items?.[0]

  return (
    <div
      onClick={() => router.push(`/myInbox/${otherUser?.id}`)}
      className="mt-10 px-6 py-4 cursor-pointer border border-gray-300 rounded-xl hover:bg-gray-50"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Avatar src={otherUser?.image} />
          <p className="ml-4 text-xl">{otherUser?.name}</p>
        </div>
      </div>

      <div className="mt-5 text-zinc-500 hover:text-zinc-600 text-sm cursor-pointer">
        {latestMessagePreview && (
          <div className="flex justify-between">
            <div key={latestMessagePreview.id} className="left-0">
              {latestMessagePreview.user.name === currentUser
                ? 'You'
                : otherUser?.name}
              : {latestMessagePreview.content}
            </div>

            <div className="right-0">
              {formatDistanceToNow(new Date(latestMessagePreview.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConversationPreview
