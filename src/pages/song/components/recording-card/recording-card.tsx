import { useState } from 'react'

import type { RecordingDetails } from '#globals/types/global-types'

import { AudioBarPlayer } from '../audio-bar-player/audio-bar-player'

import styles from './recording-card.module.css'

interface RecordingCardProps {
  recording: RecordingDetails
  sectionTitle: string | null
}

export const RecordingCard = ({ recording, sectionTitle }: RecordingCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const formatDuration = () => {
    if (!recording.durationSeconds) return '0:00'

    const totalSeconds = Math.floor(recording.durationSeconds)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatDate = () => {
    const date = new Date(recording.createdAt)
    const today = new Date()

    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()

    if (isToday) {
      return 'Recorded today'
    }

    return `Recorded ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  const handleRename = (id: string) => {
    console.log('Rename', id)
  }

  const handleDelete = (id: string) => {
    console.log('Delete', id)
  }

  return (
    <div className={styles.recordingCard}>
      <div className={styles.recordingCardHeader}>
        <h2 className={styles.recordingCardTitle}>{recording.name}</h2>
        <p className={styles.recordingCardDuration}>{formatDuration()}</p>
      </div>

      <div className={styles.recordingCardDetailsSection}>
        <p className={styles.recordingCardDetailsSectionItem}>
          {sectionTitle} | {formatDate()}
        </p>
      </div>

      <AudioBarPlayer
        audioBlob={recording.blob}
        handleOnRemove={() => handleDelete(recording.id)}
        handleOnEdit={() => handleRename(recording.id)}
      />
    </div>
  )
}
