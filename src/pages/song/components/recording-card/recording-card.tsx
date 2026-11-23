import { useState } from 'react'

import { FaPlay, FaPause } from 'react-icons/fa'

import type { RecordingDetails } from '#globals/types/global-types'

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

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleRename = () => {
    console.log('Rename')
  }

  const handleDelete = () => {
    console.log('Delete')
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

      <div className={styles.recordingCardControlsSection}>
        <div className={styles.recordingCardControls}>
          {!isPlaying ? (
            <div>
              <button className={styles.recordingCardControlsButton} onClick={handlePlay}>
                <FaPlay /> Play
              </button>
            </div>
          ) : (
            <div>
              <button className={styles.recordingCardControlsButton} onClick={handlePause}>
                <FaPause /> Playing
              </button>
            </div>
          )}
        </div>

        <div className={styles.recordingCardControlsOptions}>
          <button className={styles.recordingCardControlsOptionsButton} onClick={handleRename}>
            Rename
          </button>

          <button className={styles.recordingCardControlsOptionsButton} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
