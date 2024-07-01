'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import qs from 'query-string'
import { useSocket } from '../providers/socketProvider'

interface ChatQueryProps {
  queryKey: string
  apiUrl: string
  paramKey: 'conversationId'
  paramValue: string
}

// hook to fetch chat messages and manage pagination.
// when add new messages, the use chat query triggers re-render and this is called again
export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket()

  const fetchMessages = async ({ pageParam = undefined }: any) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    )

    const res = await fetch(url)
    return res.json()
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor, // last page from the get direct-messages API
    refetchInterval: isConnected ? false : 1000,
    initialPageParam: null, // Set this to null or provide a valid initial value
  })

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  }
}
