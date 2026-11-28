import { useState } from 'react'

import { RecordingContainer } from '#pages/song/components/recordings/recording-container/recording-container'
import { NotesContainer } from '#pages/song/components/notes/notes-container/notes-container'

import type { LyricsSection, RecordingDetails, NotesDetails } from '#globals/types/global-types.tsx'

import styles from './recording-notes-container.module.css'

interface RecordingNotesContainerProps {
  songId: string
  sectionId: string | null
  sections: LyricsSection[]
  recordings: RecordingDetails[]
  notes: NotesDetails[]
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
