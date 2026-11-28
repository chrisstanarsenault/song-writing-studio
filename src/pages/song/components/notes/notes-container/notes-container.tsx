import { useState } from 'react'

import type { NoteFormInput, NotesDetails, CreateNoteInput, LyricsSection } from '#globals/types/global-types.tsx'

import { addNote } from '#features/notes/notes-data'

import { GlobalButton } from '#globals/components/global-button/global-button.tsx'
import { NotesModal } from '#pages/song/components/notes/notes-modal/notes-modal'
import { NotesCard } from '#pages/song/components/notes/notes-card/notes-card.tsx'

import styles from './notes-container.module.css'

interface NotesContainerProps {
  songId: string
  sectionId: string | null
  sections: LyricsSection[]
  notes: NotesDetails[]
  handleOnEdit: (id: string, name: string) => void
  handleOnRemove: (id: string) => void
}

export const NotesContainer = ({
  songId,
  sectionId,
  sections,
  notes,
  handleOnEdit,
  handleOnRemove
}: NotesContainerProps) => {
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
      {notes.length === 0 ? (
        <p>{`No notes found ${sectionId ? 'for this section' : ''}`}</p>
      ) : (
        notes.map(note => {
          const sectionTitle =
            note.sectionId === null
              ? 'Entire song'
              : (sections.find(section => section.id === note.sectionId)?.title ?? 'Section unavailable')

          return (
            <NotesCard
              key={note.id}
              note={note}
              sectionTitle={sectionTitle}
              handleOnEdit={() => handleOnEdit(note.id, note.name)}
              handleOnRemove={() => handleOnRemove(note.id)}
            />
          )
        })
      )}

      <GlobalButton onClick={() => setShowNotesModal(true)} disabled={error !== null}>
        Add Note
      </GlobalButton>

      {showNotesModal && <NotesModal mode="create" onSave={handleSaveNote} onClose={handleCloseNotesModal} />}
    </section>
  )
}
