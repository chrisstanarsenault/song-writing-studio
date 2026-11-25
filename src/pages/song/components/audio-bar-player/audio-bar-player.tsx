import { useRef, useState, useEffect } from 'react'
import { useWavesurfer } from '@wavesurfer/react'
import { FaPlay, FaPause } from 'react-icons/fa'

import styles from './audio-bar-player.module.css'

interface AudioBarPlayerProps {
  audioBlob: Blob
  handleOnRemove: () => void
  handleOnEdit: () => void
}

export const AudioBarPlayer = ({ audioBlob, handleOnRemove, handleOnEdit }: AudioBarPlayerProps) => {
  const containerRef = useRef(null)
  // const [isPlaying, setIsPlaying] = useState(false)

  // Initialize wavesurfer
  const { wavesurfer, isReady, isPlaying } = useWavesurfer({
    container: containerRef,
    height: 60,
    waveColor: '#596579', // Unplayed bar color
    progressColor: '#6746d8', // Moving progress bar color
    cursorColor: 'transparent', // Hides the vertical playhead line for a cleaner look
    barWidth: 5, // Turns the wave into vertical bars
    barMinHeight: 4, // Minimum height of the bars
    barHeight: 4, // Maximum height of the bars
    barGap: 2, // Space between bars
    barRadius: 4 // Rounded bar edges
  })

  // Convert the Blob to a browser-playable URL
  useEffect(() => {
    if (!audioBlob || !wavesurfer) return

    let cancelled = false

    const loadAudio = async () => {
      try {
        await wavesurfer.loadBlob(audioBlob)
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load recording: ', error)
        }
      }
    }

    void loadAudio()

    return () => {
      cancelled = true
    }
  }, [audioBlob, wavesurfer])

  const togglePlay = () => {
    if (wavesurfer) {
      wavesurfer.playPause()
    }
  }

  return (
    <div className={styles.audioBarPlayerContainer}>
      {/* WaveSurfer renders the bars inside this div */}
      <div ref={containerRef} className={styles.audioBarPlayerWaveSurferContainer} />

      <div className={styles.audioBarPlayerControlsSection}>
        <div className={styles.audioBarPlayerControls}>
          <button className={styles.audioBarPlayerControlsButton} onClick={togglePlay} disabled={!isReady}>
            {!isPlaying ? <FaPlay /> : <FaPause />} {isPlaying ? 'Playing' : 'Play'}
          </button>
        </div>

        <div className={styles.audioBarPlayerControlsOptions}>
          <button className={styles.audioBarPlayerControlsOptionsButton} onClick={handleOnEdit}>
            Rename
          </button>

          <button className={styles.audioBarPlayerControlsOptionsButton} onClick={handleOnRemove}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
