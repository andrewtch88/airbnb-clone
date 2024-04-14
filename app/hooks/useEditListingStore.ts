import { create } from 'zustand'
import { safeListing } from '@/app/types'

interface EditListingStore {
  listing: safeListing | null
  setListing: (listing: safeListing | null) => void
}

export const useEditListingStore = create<EditListingStore>((set) => ({
  listing: null,
  setListing: (newListing) => set({ listing: newListing }),
}))
