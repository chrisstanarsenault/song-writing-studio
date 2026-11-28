import { useState } from 'react'

import type { NoteFormInput, NotesDetails, CreateNoteInput, LyricsSection } from '#globals/types/global-types.tsx'

import { addNote, updateNote, deleteNote } from '#features/notes/notes-data'

import { GlobalButton } from '#globals/components/global-button/global-button.tsx'
import { NotesModal } from '#pages/song/components/notes/notes-modal/notes-modal'
import { NotesCard } from '#pages/song/components/notes/notes-card/notes-card.tsx'

import styles from './notes-container.module.css'

interface NotesContainerProps {
  songId: string
  sectionId: string | null
  sections: LyricsSection[]
  notes: NotesDetails[]
}

export const NotesContainer = ({ songId, sectionId, sections, notes }: NotesContainerProps) => {
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<{ mode: 'create' } | { mode: 'edit'; details: NoteFormInput }>({
    mode: 'create'
  })
  const [formData, setFormData] = useState<NoteFormInput>({
    name: '',
    content: ''
  })

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

  const handleOnEditNote = async (input: NoteFormInput) => {
    try {
      await updateNote(selectedNoteId || '', input)
      setError(null)
      setShowNotesModal(false)
    } catch (error) {
      console.error('error updating note:', error)
      setError('Failed to update note.')
    }
  }

  const handleOnRemoveNote = async (id: string) => {
    try {
      await deleteNote(id)
    } catch (error) {
      console.error('error deleting note:', error)
      setError('Failed to delete note.')
    }
  }

  const handleOpenNotesModalForEdit = (id: string | null, input: NoteFormInput) => {
    setSelectedNoteId(id)
    setFormData(input)
    setModalMode({ mode: 'edit', details: input })
    setShowNotesModal(true)
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
              handleOnEdit={() => handleOpenNotesModalForEdit(note.id, { name: note.name, content: note.content })}
              handleOnRemove={() => handleOnRemoveNote(note.id)}
            />
          )
        })
      )}

      <GlobalButton onClick={() => setShowNotesModal(true)} disabled={error !== null}>
        Add Note
      </GlobalButton>

      {showNotesModal && modalMode.mode === 'create' && (
        <NotesModal mode="create" onSave={handleSaveNote} onEdit={handleOnEditNote} onClose={handleCloseNotesModal} />
      )}

      {showNotesModal && modalMode.mode === 'edit' && (
        <NotesModal
          mode="edit"
          sectionId={sectionId}
          details={modalMode.details}
          onSave={handleSaveNote}
          onEdit={handleOnEditNote}
          onClose={handleCloseNotesModal}
        />
      )}
    </section>
  )
}
