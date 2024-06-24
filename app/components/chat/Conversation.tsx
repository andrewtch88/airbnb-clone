'use client'

import { useRouter } from 'next/navigation'
import { User, DirectMessage } from '@prisma/client'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Avatar from '../Avatar'
import { useChatQuery } from '@/app/hooks/use-chat-query'
import { formatDistanceToNow } from 'date-fns'
import { safeInboxNotification } from '@/app/types'

type MessageWithMember = DirectMessage & {
  user: User // access user Model from DirectMessage (relation)
}

interface ConversationProps {
  currentUser: User
  notifications?: safeInboxNotification | null
  conversationId: string
}

const ConversationPreview: React.FC<ConversationProps> = ({
  currentUser,
  notifications,
  conversationId,
}) => {
  const router = useRouter()

  const [otherUser, setOtherUser] = useState<User | null>(null)
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/conversations/${conversationId}`)
      setOtherUser(response.data)
    }

    fetchData()
  }, [conversationId])

  const queryKey = `chat:${conversationId}`
  const apiUrl = `/api/direct-messages`
  const paramKey = 'conversationId'
  const paramValue = conversationId

  const { data } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  })

  // messageWithMember type
  const latestMessagePreview = data?.pages?.[0]?.items?.[0]

  const textClass = notifications?.conversations?.conversationIds.includes(
    conversationId
  )
    ? 'font-bold'
    : 'text-zinc-500'

  const onClickConversation = useCallback(
    (userId: string | undefined, convId: string) => {
      router.push(`/myInbox/${userId}`)

      axios
        .put(`/api/notification/${convId}`)
        .then(() => {
          router.refresh()
        })
        .catch(() => {
          console.log('something went wrong')
        })
    },
    [router]
  )

  return (
    <div
      onClick={() => onClickConversation(otherUser?.id, conversationId)}
      className="mt-10 px-6 py-4 cursor-pointer border border-gray-300 rounded-xl hover:bg-gray-50"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Avatar src={otherUser?.image} />
          <p className="ml-4 text-xl">{otherUser?.name}</p>
        </div>
      </div>

      <div className={`mt-5 text-sm cursor-pointer ${textClass}`}>
        {latestMessagePreview && (
          <div className="flex justify-between">
            <div key={latestMessagePreview.id} className="left-0">
              {latestMessagePreview.user.name === currentUser.name
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
