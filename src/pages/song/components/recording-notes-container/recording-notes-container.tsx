import { useState } from 'react'
import { toast } from 'react-toastify'

import { RecordingContainer } from '#pages/song/components/recording-container/recording-container.tsx'
import { NotesContainer } from '#pages/song/components/notes-container/notes-container.tsx'

import type { LyricsSection, RecordingDetails } from '#globals/types/global-types.tsx'

import styles from './recording-notes-container.module.css'

interface RecordingNotesContainerProps {
  songId: string
  sectionId: string | null
  sections: LyricsSection[]
  recordings: RecordingDetails[]
  notes: Note[]
}

type Tab = 'recordings' | 'notes'

export const RecordingNotesContainer = ({
  songId,
  sectionId,
  sections,
  recordings,
  notes
}: RecordingNotesContainerProps) => {
  const [selectedTab, setSelectedTab] = useState<Tab>('recordings')

  const handleTabChange = (tab: Tab) => {
    setSelectedTab(tab)
  }

  return (
    <section className={styles.recordingNotesContainer}>
      <div className={styles.recordingNotesContainerTabs}>
        <button
          className={`${styles.recordingNotesContainerTab} ${selectedTab === 'recordings' ? styles.recordingNotesContainerTabActive : ''}`}
          onClick={() => handleTabChange('recordings')}
        >
          Recordings
        </button>

        <button
          className={`${styles.recordingNotesContainerTab} ${selectedTab === 'notes' ? styles.recordingNotesContainerTabActive : ''}`}
          onClick={() => handleTabChange('notes')}
        >
          Notes
        </button>
      </div>

      {selectedTab === 'recordings' && (
        <RecordingContainer songId={songId} sectionId={sectionId} sections={sections} recordings={recordings} />
      )}
      {selectedTab === 'notes' && (
        <NotesContainer songId={songId} sectionId={sectionId} sections={sections} notes={notes} />
      )}
    </section>
  )
}
