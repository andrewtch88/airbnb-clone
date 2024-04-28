import { create } from 'zustand'

interface ReviewModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const useReviewModal = create<ReviewModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default useReviewModal
