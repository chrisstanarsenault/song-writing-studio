import { MdModeEdit, MdDelete } from 'react-icons/md'

import type { NotesDetails, NoteFormInput } from '#globals/types/global-types'

import styles from './notes-card.module.css'

interface NotesCardProps {
  note: NotesDetails
  sectionTitle: string | null
  handleOnEdit: (id: string, input: NoteFormInput) => void
  handleOnRemove: (id: string) => void
}

export const NotesCard = ({ note, sectionTitle, handleOnRemove, handleOnEdit }: NotesCardProps) => {
  const formatDate = () => {
    const date = new Date(note.createdAt)
    const today = new Date()

    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()

    if (isToday) {
      return 'Noted today'
    }

    return `Noted on ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
  }
  return (
    <div className={styles.notesCard}>
      <div className={styles.notesCardHeader}>
        <h2 className={styles.notesCardTitle}>{note.name}</h2>

        <div className={styles.notesCardHeaderButtons}>
          <button
            className={styles.notesCardHeaderButton}
            onClick={() => handleOnEdit(note.id, { name: note.name, content: note.content })}
          >
            <MdModeEdit />
          </button>

          <button className={styles.notesCardHeaderButton} onClick={() => handleOnRemove(note.id)}>
            <MdDelete />
          </button>
        </div>
      </div>

      <div className={styles.notesCardDetailsSection}>
        <p className={styles.notesCardDetailsSectionItem}>
          {sectionTitle} | {formatDate()}
        </p>
      </div>

      <div className={styles.notesCardContentSection}>
        <p className={styles.notesCardContentSectionItem}>{note.content}</p>
      </div>
    </div>
  )
}
