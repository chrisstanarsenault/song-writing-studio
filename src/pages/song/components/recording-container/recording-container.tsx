import { useState } from 'react'
import { toast } from 'react-toastify'

import { GlobalButton } from '#globals/components/global-button/global-button'
import { RecordingModal } from '#pages/song/components/recording-modal/recording-modal.tsx'
import { UpdateRecordingModal } from '#pages/song/components/update-recording-modal/update-recording-modal.tsx'
import { RecordingCard } from '#pages/song/components/recording-card/recording-card.tsx'

import { addRecording, updateRecording, deleteRecording } from '#features/recordings/recording-data.ts'

import type {
  RecordingFormInput,
  RecordingFormData,
  RecordingDetails,
  LyricsSection
} from '#globals/types/global-types.tsx'

import styles from './recording-container.module.css'

interface RecordingContainerProps {
  songId: string
  sectionId: string | null
  sections: LyricsSection[]
  recordings: RecordingDetails[]
}

type UpdateRecordingDetails = {
  id: string
  name: string
}

type UpdateRecordingFormInput = {
  name: string
}

export const RecordingContainer = ({ songId, sectionId, sections, recordings }: RecordingContainerProps) => {
  const [recordingModalIsOpen, setRecordingModalIsOpen] = useState(false)
  const [updateRecordingModalIsOpen, setUpdateRecordingModalIsOpen] = useState(false)
  const [updateRecordingDetails, setUpdateRecordingDetails] = useState<UpdateRecordingDetails | null>(null)

  const handleSaveRecording = async (formData: RecordingFormInput) => {
    try {
      if (!songId) throw new Error('Song not found')

      await addRecording(formData)

      setRecordingModalIsOpen(false)
    } catch (error) {
      toast.error('Failed to add new recording')
      throw error
    }
  }

  const openUpdateRecordingModal = async (id: string, name: string) => {
    setUpdateRecordingDetails({ id, name })
    setUpdateRecordingModalIsOpen(true)
  }

  const handleUpdateRecordingDetails = async (formData: UpdateRecordingFormInput) => {
    try {
      if (!songId) throw new Error('Song not found')
      if (!updateRecordingDetails?.id) throw new Error('Recording not found')

      await updateRecording(updateRecordingDetails.id, formData)

      setUpdateRecordingModalIsOpen(false)
      setUpdateRecordingDetails(null)
    } catch (error) {
      toast.error('Failed to update recording')
      throw error
    }
  }

  const handleDeleteRecording = async (id: string) => {
    try {
      if (!songId) throw new Error('Song not found')
      if (!id) throw new Error('Recording not found')

      await deleteRecording(id)
    } catch (error) {
      toast.error('Failed to update recording')
      throw error
    }
  }

  return (
    <section className={styles.recordingContainer}>
      <div className={styles.recordingContainerCards}>
        {recordings.length > 0 ? (
          recordings.map(recording => {
            const sectionTitle =
              recording.sectionId === null
                ? 'Entire song'
                : (sections.find(section => section.id === recording.sectionId)?.title ?? 'Section unavailable')

            return (
              <RecordingCard
                key={recording.id}
                recording={recording}
                sectionTitle={sectionTitle}
                handleOnEdit={openUpdateRecordingModal}
                handleOnRemove={handleDeleteRecording}
              />
            )
          })
        ) : (
          <p>No recordings found</p>
        )}
      </div>

      <GlobalButton variant="primary" onClick={() => setRecordingModalIsOpen(true)}>
        Record Idea
      </GlobalButton>

      {recordingModalIsOpen && (
        <RecordingModal
          onClose={() => setRecordingModalIsOpen(false)}
          handleSubmit={event => handleSaveRecording(event as RecordingFormData)}
          sectionId={sectionId}
          songId={songId}
        />
      )}

      {updateRecordingModalIsOpen && (
        <UpdateRecordingModal
          name={updateRecordingDetails?.name || ''}
          sectionId={updateRecordingDetails?.id || null}
          onClose={() => setUpdateRecordingModalIsOpen(false)}
          handleSubmit={event => handleUpdateRecordingDetails(event as UpdateRecordingFormInput)}
        />
      )}
    </section>
  )
}
