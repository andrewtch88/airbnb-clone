import { create } from 'zustand'

interface ContactHostModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const useContactHostModalStore = create<ContactHostModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default useContactHostModalStore
