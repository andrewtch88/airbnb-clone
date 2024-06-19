import { DirectMessage, User } from '@prisma/client'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSocket } from '../providers/socketProvider'

type ChatSocketProps = {
  addKey: string
  queryKey: string
}

type MessageWithMemberWithProfile = DirectMessage & {
  member: User
}

export const useChatSocket = ({ addKey, queryKey }: ChatSocketProps) => {
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) {
      return
    }

    // listen for to receive new messages (on emit function in pages/api/socket/dm)
    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          }
        }

        const newData = [...oldData.pages]

        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        }

        return {
          ...oldData,
          pages: newData,
        }
      })
    })

    return () => {
      socket.off(addKey)
    }
  }, [queryClient, addKey, queryKey, socket])
}
