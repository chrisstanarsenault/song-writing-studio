import { useId, useState } from 'react'

import type { NoteFormInput } from '#globals/types/global-types'

import { Modal } from '#globals/components/modal-portal/modal-portal'
import { GlobalButton } from '#globals/components/global-button/global-button'

import styles from './notes-modal.module.css'

type NotesModalProps = {
  sectionId: string | null
  onSave: (input: NoteFormInput) => Promise<void>
  onEdit: (input: NoteFormInput) => Promise<void>
  onClose: () => void
} & ({ mode: 'create' } | { mode: 'edit'; details: NoteFormInput })

export const NotesModal = (props: NotesModalProps) => {
  const { mode, onSave, onEdit, onClose } = props

  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<NoteFormInput>(
    props.mode === 'edit'
      ? { ...props.details }
      : {
          name: '',
          content: ''
        }
  )

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

    if (mode === 'create') {
      await onSave(noteDetails)
    } else {
      await onEdit(noteDetails)
    }
  }

  return (
    <Modal titleId={noteId} onClose={onClose}>
      <div>
        <h2>{mode === 'create' ? 'New note' : 'Edit note'}</h2>

        <form onSubmit={handleSubmitForm} className={styles.notesForm}>
          <div className={styles.nameContainer}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name your note..."
              value={formData.name}
              onChange={event => setFormData({ ...formData, name: event.target.value })}
            />
          </div>

          <div className={styles.contentContainer}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              placeholder="Enter your note..."
              value={formData.content}
              onChange={event => setFormData({ ...formData, content: event.target.value })}
            />
          </div>

          <GlobalButton type="submit" disabled={formData.content.trim() === '' || formData.name.trim() === ''}>
            {mode === 'create' ? 'Create note' : 'Update note'}
          </GlobalButton>
        </form>
      </div>
    </Modal>
  )
}
