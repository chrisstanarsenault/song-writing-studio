import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import styles from './modal-portal.module.css'

interface ModalProps {
  children: ReactNode
  titleId: string
  onClose: () => void
}

export const Modal = ({ children, titleId, onClose }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const previousOverflow = document.body.style.overflow

    dialog.showModal()
    document.body.style.overflow = 'hidden'

    dialog.querySelector<HTMLElement>('[data-initial-focus]')?.focus()

    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const container = document.getElementById('modal-portal')

  if (!container) {
    console.error('Modal portal not found')
    return null
  }

  return createPortal(
    <dialog
      className={styles.dialog}
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={event => {
        event.preventDefault()
        onClose()
      }}
    >
      {children}
    </dialog>,
    container
  )
}
