'use client'

import { createContext, useState, useContext } from 'react'
import { safeListing } from '@/app/types'

interface GlobalContextProps {
  listing: safeListing | null
  setListing: React.Dispatch<React.SetStateAction<safeListing | null>>
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined)

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error(
      'useGlobalContext must be used within a GlobalContext.Provider'
    )
  }
  return context
}

export const EditListingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [listing, setListing] = useState<safeListing | null>(null)

  return (
    <GlobalContext.Provider value={{ listing, setListing }}>
      {children}
    </GlobalContext.Provider>
  )
}
