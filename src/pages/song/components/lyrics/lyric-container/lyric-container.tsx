import { FaArrowUp, FaArrowDown } from 'react-icons/fa6'
import { MdEdit } from 'react-icons/md'
import { IoIosMore } from 'react-icons/io'
import { IoTrashOutline } from 'react-icons/io5'

// import type { RecordingDetails, NotesDetails } from '../../../../globals/types/global-types'

import styles from './lyric-container.module.css'

interface LyricContainerProps {
  title: string | null
  chords: string[]
  lyrics: string | null
  // linkedRecording?: RecordingDetails | null
  // linkedNotes?: NotesDetails | null
  isSelected: boolean
  onMoveDown: () => void
  onMoveUp: () => void
  onEdit: () => void
  onDelete: () => void
  onRecordingNotes: () => void
  onSelect: () => void
}

export const LyricContainer = ({
  title = '',
  chords = [],
  lyrics = '',
  // linkedRecording = null,
  // linkedNotes = null,
  isSelected,
  onSelect,
  onMoveDown,
  onMoveUp,
  onEdit,
  onDelete
}: LyricContainerProps) => {
  const handleMoveDown = () => {
    onMoveDown()
  }

  const handleMoveUp = () => {
    onMoveUp()
  }

  const handleEdit = () => {
    onEdit()
  }

  const handleDelete = () => {
    onDelete()
  }

  const handleRecordingNotes = () => {
    onSelect()
  }

  return (
    <section className={`${styles.lyricContainer} ${isSelected ? styles.selected : ''}`}>
      <div className={styles.lyricHeader}>
        <p>{title}</p>

        <div className={styles.lyricHeaderActions}>
          <button type="button" aria-label={`Move ${title || 'section'} down`} onClick={() => handleMoveDown()}>
            <FaArrowDown aria-hidden="true" />
          </button>

          <button type="button" aria-label={`Move ${title || 'section'} up`} onClick={() => handleMoveUp()}>
            <FaArrowUp aria-hidden="true" />
          </button>

          <button type="button" aria-label={`Edit ${title || 'section'}`} onClick={() => handleEdit()}>
            <MdEdit aria-hidden="true" />
          </button>

          <button type="button" aria-label={`Delete ${title || 'section'}`} onClick={() => handleDelete()}>
            <IoTrashOutline aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label={`View recording and notes for ${title || 'section'}`}
            aria-pressed={isSelected}
            onClick={() => handleRecordingNotes()}
          >
            <IoIosMore aria-hidden="true" />
          </button>
        </div>
      </div>

      <section className={styles.chordsContainer}>
        {chords.map(chord => (
          <p key={chord}>{chord}</p>
        ))}
      </section>

      <section className={styles.lyricsContainer}>
        <p className={styles.lyricsText}>{lyrics}</p>
      </section>
    </section>
  )
}
