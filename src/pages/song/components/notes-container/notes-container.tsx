import { useState } from 'react'

import type { NoteFormInput, NotesDetails, CreateNoteInput } from '#globals/types/global-types.tsx'

import { addNote } from '#features/notes/notes-data'

import { GlobalButton } from '#globals/components/global-button/global-button.tsx'
import { NotesModal } from '#pages/song/components/notes-modal/notes-modal.tsx'

import styles from './notes-container.module.css'

interface NotesContainerProps {
  songId: string
  sectionId: string | null
  notes: NotesDetails[]
}

export const NotesContainer = ({ songId, sectionId, notes }: NotesContainerProps) => {
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSaveNote = async (input: NoteFormInput) => {
    const noteDetails: CreateNoteInput = {
      songId,
      sectionId: sectionId || null,
      name: input.name.trim() || 'Untitled Note',
      content: input.content.trim() || ''
    }

    try {
      await addNote(noteDetails)
      setShowNotesModal(false)
    } catch (error) {
      console.error('error saving note:', error)
      setError('Failed to save note.')
    }
  }

  const handleCloseNotesModal = () => {
    setShowNotesModal(false)
    setError(null)
  }

  return (
    <section className={styles.notesContainer}>
      {notes.length === 0 && <p>No notes found</p>}
      <GlobalButton onClick={() => setShowNotesModal(true)}>Add Note</GlobalButton>

      {showNotesModal && <NotesModal mode="create" onSave={handleSaveNote} onClose={handleCloseNotesModal} />}
    </section>
  )
}
