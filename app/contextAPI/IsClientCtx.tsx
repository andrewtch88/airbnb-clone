'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const IsClientCtx = createContext(false)

interface IsClientCtxProviderProps {
  children: React.ReactNode
}

export const IsClientCtxProvider: React.FC<IsClientCtxProviderProps> = ({
  children,
}) => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])
  return (
    <IsClientCtx.Provider value={isClient}>{children}</IsClientCtx.Provider>
  )
}

export function useIsClient() {
  return useContext(IsClientCtx)
}
