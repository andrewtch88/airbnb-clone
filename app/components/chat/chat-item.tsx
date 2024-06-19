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

export const ChatItem = ({ id, content, member, timestamp }: ChatItemProps) => {
  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <Avatar src={member.image} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member.name}
              </p>
            </div>
            <span className="text-xs text-zinc-500">{timestamp}</span>
          </div>
          <p className={`text-sm text-zinc-600`}>{content}</p>
        </div>
      </div>
    </div>
  )
}
