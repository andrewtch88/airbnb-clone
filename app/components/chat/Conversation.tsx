'use client'

import { useRouter } from 'next/navigation'
import { Conversation, User } from '@prisma/client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Avatar from '../Avatar'

interface ConversationProps {
  conversation: Conversation
}

const ConversationPreview: React.FC<ConversationProps> = ({ conversation }) => {
  const router = useRouter()
  const [otherUser, setOtherUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/conversations/${conversation.id}`)
      setOtherUser(response.data)
    }

    fetchData()
  }, [conversation.id])

  return (
    <div className="mt-10 px-6 py-4 cursor-pointer border border-gray-300 rounded-xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Avatar src={otherUser?.image} />
          <p className="ml-4 text-xl">{otherUser?.name}</p>
        </div>
      </div>

      <p
        onClick={() => router.push(`/myInbox/${otherUser?.id}`)}
        className="mt-5 text-zinc-500 hover:text-zinc-600 text-sm cursor-pointer"
      >
        Andrew Tan Chun Hung: Yes, Haha 1mo ago
      </p>
    </div>
  )
}

export default ConversationPreview
