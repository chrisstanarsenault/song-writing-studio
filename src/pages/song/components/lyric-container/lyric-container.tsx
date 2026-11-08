import { FaArrowUp, FaArrowDown } from 'react-icons/fa6'
import { MdEdit } from 'react-icons/md'
import { IoIosMore } from 'react-icons/io'
import { IoTrashOutline } from 'react-icons/io5'

import type { RecordingDetails, NotesDetails } from '../../../../globals/types/global-types'

import styles from './lyric-container.module.css'

interface LyricContainerProps {
  title?: string
  chords?: string[]
  index?: number
  lyrics?: string
  linkedRecording?: RecordingDetails | null
  linkedNotes?: NotesDetails | null
}

export const LyricContainer = ({
  title = 'Verse 1',
  chords = ['G', 'D', 'Em', 'C'],
  index = 1,
  lyrics = 'Lyrics lyrics lyrics lyrics',
  linkedRecording = null,
  linkedNotes = null
}: LyricContainerProps) => {
  return (
    <section className={styles.lyricContainer}>
      <div className={styles.lyricHeader}>
        <p>{title}</p>

        <div className={styles.lyricHeaderActions}>
          <button type="button">
            <FaArrowDown />
          </button>

          <button type="button">
            <FaArrowUp />
          </button>

          <button type="button">
            <MdEdit />
          </button>

          <button type="button">
            <IoTrashOutline />
          </button>

          <button type="button">
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
