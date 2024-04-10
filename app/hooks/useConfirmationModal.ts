import { create } from 'zustand'

interface ConfirmationModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const useConfirmationModal = create<ConfirmationModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default useConfirmationModal
