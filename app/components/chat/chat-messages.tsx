'use client'

import { useChatQuery } from '@/app/hooks/use-chat-query'
import { DirectMessage, User } from '@prisma/client'
import { ChatWelcome } from './chat-welcome'

import { LuLoader2 } from 'react-icons/lu'
import { LuServerCrash } from 'react-icons/lu'
import { Fragment, useRef, ElementRef, useEffect } from 'react'
import { ChatItem } from './chat-item'
import { format } from 'date-fns'
import { useChatSocket } from '@/app/hooks/use-chat-socket'
import { useChatScroll } from '@/app/hooks/use-chat-scroll'

const DATE_FORMAT = 'd MMM yyyy, HH:mm'

type MessageWithMember = DirectMessage & {
  user: User // access user Model from DirectMessage (relation)
}

interface ChatMessagesProps {
  name: string | null
  user: User
  chatId: string
  apiUrl: string
  paramKey: 'conversationId'
  paramValue: string
}

export const ChatMessages = ({
  name,
  user,
  chatId,
  apiUrl,
  paramKey,
  paramValue,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`

  const chatRef = useRef<ElementRef<'div'>>(null)
  const bottomRef = useRef<ElementRef<'div'>>(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatId])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  })

  useChatSocket({ queryKey, addKey })
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  })

  if (status === 'pending') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <LuLoader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <LuServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    )
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && (
        <>
          <div className="flex-1" />
          <ChatWelcome type="conversation" name={name} />
        </>
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <LuLoader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              type="button"
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 text-xs my-4 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((
          group,
          i // data has unknown type so use MessageWithMember type
        ) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMember) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={user}
                member={message.user}
                content={message.content}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
