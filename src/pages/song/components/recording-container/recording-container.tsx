import { useState } from 'react'
import { toast } from 'react-toastify'

import { GlobalButton } from '#globals/components/global-button/global-button'
import { RecordingModal } from '#pages/song/components/recording-modal/recording-modal.tsx'
import { RecordingCard } from '#pages/song/components/recording-card/recording-card.tsx'

import { addRecording, updateRecording, deleteRecording } from '#features/recordings/recording-data.ts'

import type {
  RecordingFormInput,
  RecordingFormData,
  RecordingDetails,
  LyricsSection
} from '#globals/types/global-types.tsx'

import styles from './recording-container.module.css'

type RecordingModalState = { mode: 'create' } | { mode: 'edit'; recordingId: string } | null

interface RecordingContainerProps {
  songId: string
  sectionId: string | null
  sections: LyricsSection[]
  recordings: RecordingDetails[]
}

export const RecordingContainer = ({ songId, sectionId, sections, recordings }: RecordingContainerProps) => {
  const [recordingModalState, setRecordingModalState] = useState<RecordingModalState | null>(null)

  const handleSaveRecording = async (formData: RecordingFormInput) => {
    try {
      if (!songId) throw new Error('Song not found')

      await addRecording(formData)

      setRecordingModalState(null)
    } catch (error) {
      toast.error('Failed to add new recording')
      throw error
    }
  }

  return (
    <section className={styles.recordingContainer}>
      <p className={styles.recordingContainerTitle}>Audio</p>

      <div className={styles.recordingContainerCards}>
        {recordings.length > 0 ? (
          recordings.map(recording => {
            const sectionTitle =
              recording.sectionId === null
                ? 'Entire song'
                : (sections.find(section => section.id === recording.sectionId)?.title ?? 'Section unavailable')

            return <RecordingCard key={recording.id} recording={recording} sectionTitle={sectionTitle} />
          })
        ) : (
          <p>No recordings found</p>
        )}
      </div>

      <GlobalButton variant="primary" onClick={() => setRecordingModalState({ mode: 'create' })}>
        Record Idea
      </GlobalButton>

      {recordingModalState && (
        <RecordingModal
          onClose={() => setRecordingModalState(null)}
          handleSubmit={event => handleSaveRecording(event as RecordingFormData)}
          sectionId={sectionId}
          songId={songId}
          mode="create"
        />
      )}
    </section>
  )
}
