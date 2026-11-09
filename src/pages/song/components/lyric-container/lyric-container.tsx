import { FaArrowUp, FaArrowDown } from 'react-icons/fa6'
import { MdEdit } from 'react-icons/md'
import { IoIosMore } from 'react-icons/io'
import { IoTrashOutline } from 'react-icons/io5'

import type { RecordingDetails, NotesDetails } from '../../../../globals/types/global-types'

import styles from './lyric-container.module.css'

interface LyricContainerProps {
  id: string
  title: string
  chords: string[]
  index?: number
  lyrics: string
  linkedRecording?: RecordingDetails | null
  linkedNotes?: NotesDetails | null
  onMoveDown: () => void
  onMoveUp: () => void
  onEdit: () => void
  onDelete: () => void
  onRecordingNotes: () => void
}

export const LyricContainer = ({
  id,
  title = 'Verse 1',
  chords = ['G', 'D', 'Em', 'C'],
  index = 1,
  lyrics = 'Lyrics lyrics lyrics lyrics',
  linkedRecording = null,
  linkedNotes = null,
  onMoveDown,
  onMoveUp,
  onEdit,
  onDelete,
  onRecordingNotes
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
    onRecordingNotes()
  }

  return (
    <section className={styles.lyricContainer}>
      <div className={styles.lyricHeader}>
        <p>{title}</p>

        <div className={styles.lyricHeaderActions}>
          <button type="button" onClick={() => handleMoveDown()}>
            <FaArrowDown />
          </button>

          <button type="button" onClick={() => handleMoveUp()}>
            <FaArrowUp />
          </button>

          <button type="button" onClick={() => handleEdit()}>
            <MdEdit />
          </button>

          <button type="button" onClick={() => handleDelete()}>
            <IoTrashOutline />
          </button>

          <button type="button" onClick={() => handleRecordingNotes()}>
            <IoIosMore />
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
