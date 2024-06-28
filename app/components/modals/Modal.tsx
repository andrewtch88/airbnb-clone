'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import Button from '../Button'

interface ModalProps {
  isOpen?: boolean
  onClose: () => void
  onSubmit?: () => void
  title?: string
  body?: React.ReactElement
  footer?: React.ReactElement
  actionLabel?: string
  disabled?: boolean
  secondaryAction?: () => void // action to be taken when secondary button is clicked
  secondaryActionLabel?: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(isOpen) // isOpen prop to determine whether modal is open or closed

  useEffect(() => {
    setShowModal(isOpen)
  }, [isOpen])

  // if disabled then exit early
  const handleClose = useCallback(() => {
    if (disabled) {
      return
    }

    setShowModal(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }, [disabled, onClose]) // with useCallback, The function will only be re-created if any of these dependencies change.

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return
    }

    onSubmit?.()
  }, [disabled, onSubmit])

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return
    }

    secondaryAction()
  }, [disabled, secondaryAction])

  /* When the height of Modal exceeds the height of the screen, set margin-top */
  const ModalRef = useRef<HTMLDivElement>(null)
  const handleModalMarginTop = useCallback(() => {
    if (ModalRef.current) {
      const viewportHeight = window.innerHeight
      const modalHeight = ModalRef.current.clientHeight

      if (modalHeight > viewportHeight) {
        ModalRef.current.style.marginTop = `
          calc(${modalHeight - viewportHeight}px + 3rem)
        `
      }
    }
  }, [ModalRef.current])
  useEffect(() => {
    handleModalMarginTop()
  }, [handleModalMarginTop])

  if (!isOpen) {
    return null
  }

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70"
        style={{ display: showModal ? 'flex' : 'none' }}
      >
        <div // w-full md:w-3/4 lg:w-2/3 xl:w-1/2 is screen dimensions
          className="relative w-full md:w-3/4 lg:w-2/3 xl:w-1/2 my-6 mx-auto h-full lg:h-auto md:h-auto overflow-y-auto"
          style={{ maxHeight: '90vh', maxWidth: '100vw' }}
        >
          {/* CONTENT */}
          <div
            className={`border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none ${
              showModal ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              position: showModal ? 'relative' : 'absolute',
              top: showModal ? '0' : '100%',
            }}
          >
            {/* HEADER */}
            <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px] sticky top-0 z-10 bg-white">
              <button
                onClick={handleClose}
                className="p-1 border-0 hover:opacity-70 transition absolute left-9"
              >
                <IoMdClose size={18} />
              </button>
              <div className="text-lg font-semibold">{title}</div>
            </div>
            {/* BODY */}
            <div className="relative p-6 overflow-y-auto">{body}</div>
            {/* FOOTER */}
            <div className="flex flex-col gap-2 p-6">
              <div className="flex flex-row items-center gap-4 w-full select-none">
                {secondaryAction && secondaryActionLabel && (
                  <Button
                    outline
                    disabled={disabled}
                    label={secondaryActionLabel}
                    onClick={handleSecondaryAction}
                  />
                )}
                <Button
                  disabled={disabled}
                  label={actionLabel}
                  onClick={handleSubmit}
                />
              </div>
              {footer}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
