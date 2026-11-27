import { useState } from 'react'

import styles from './notes-container.module.css'

export const NotesContainer = () => {
  const [notes, setNotes] = useState<string[]>([])

  return (
    <section className={styles.notesContainer}>
      <p className={styles.notesContainerTitle}>Notes</p>
    </section>
  )
}
