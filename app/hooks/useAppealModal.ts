import { create } from 'zustand'

interface AppealModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const useAppealModal = create<AppealModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default useAppealModal
