// 'use client'

import { User } from '@prisma/client'
import Avatar from '../Avatar'

interface ChatItemProps {
  id: string
  content: string
  member: User
  timestamp: string
  currentMember: User
}

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  currentMember,
}: ChatItemProps) => {
  const isCurrentMember = member.id === currentMember.id

  return (
    <div
      className={`relative group flex items-center p-4 transition w-full ${
        isCurrentMember ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`flex flex-col w-full ${
          isCurrentMember ? 'items-end' : 'items-start'
        }`}
      >
        <div className="flex items-center gap-x-2">
          <p className="font-semibold text-lg">
            {member.name === currentMember.name ? 'You' : member.name}
          </p>
          <span className="text-sm text-zinc-500">{timestamp}</span>
        </div>
        <div
          className={`group flex gap-x-2 items-start ${
            isCurrentMember ? 'flex-row-reverse' : ''
          }`}
        >
          <div className="flex flex-col w-full">
            <p
              className={`text-md text-zinc-600 ${
                isCurrentMember ? 'text-right' : ''
              }`}
            >
              {content}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
