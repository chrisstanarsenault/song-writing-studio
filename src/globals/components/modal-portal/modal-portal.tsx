import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  children: ReactNode
}

export const Modal = ({ children }: ModalProps) => {
  const container = document.getElementById('modal-portal')

  if (!container) {
    console.error('Modal portal not found')
    return null
  } else {
    console.log('Modal portal found')
  }

  return createPortal(children, container)
}
