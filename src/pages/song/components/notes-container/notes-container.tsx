import { useState } from 'react'

import type { NotesDetails } from '#globals/types/global-types.tsx'

import { GlobalButton } from '#globals/components/global-button/global-button.tsx'

import styles from './notes-container.module.css'

interface NotesContainerProps {
  songId: string
  sectionId: string | null
  notes: NotesDetails[]
}

export const NotesContainer = ({ songId, sectionId, notes }: NotesContainerProps) => {
  return (
    <section className={styles.notesContainer}>
      {notes.length === 0 && <p>No notes found</p>}
      <GlobalButton>Add Note</GlobalButton>
    </section>
  )
}
