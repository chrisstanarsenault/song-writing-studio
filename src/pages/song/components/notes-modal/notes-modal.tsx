import { useId, useRef, useState, useEffect } from 'react'

import type { NoteFormInput } from '#globals/types/global-types'

import { Modal } from '#globals/components/modal-portal/modal-portal'
import { GlobalButton } from '#globals/components/global-button/global-button'

import styles from './notes-modal.module.css'

type NotesModalProps = {
  onSave: (input: NoteFormInput) => Promise<void>
  onClose: () => void
} & ({ mode: 'create' } | { mode: 'edit'; details: NoteFormInput })

export const NotesModal = ({ onSave, onClose }: NotesModalProps) => {
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<NoteFormInput>({
    name: '',
    content: ''
  })

  const noteId = useId()

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (typeof formData.name !== 'string' || formData.name.trim() === '') {
      console.error('error submitting form: name is missing')
      setError('Please enter a name.')
      return
    }

    const noteDetails: NoteFormInput = {
      name: formData.name.trim() || 'Untitled Recording',
      content: formData.content.trim() || ''
    }

    await onSave(noteDetails)
  }

  return (
    <Modal titleId={noteId} onClose={onClose}>
      <div>
        <h2>New note</h2>

        <form onSubmit={handleSubmitForm} className={styles.notesForm}>
          <div className={styles.nameContainer}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name your note..."
              onChange={event => setFormData({ ...formData, name: event.target.value })}
            />
          </div>

          <div className={styles.contentContainer}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              placeholder="Enter your note..."
              onChange={event => setFormData({ ...formData, content: event.target.value })}
            />
          </div>

          <GlobalButton type="submit" disabled={formData.content.trim() === '' || formData.name.trim() === ''}>
            Create note
          </GlobalButton>
        </form>
      </div>
    </Modal>
  )
}
