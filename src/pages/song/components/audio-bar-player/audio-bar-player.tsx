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
  const [isPlaying, setIsPlaying] = useState(false)

  // Initialize wavesurfer
  const { wavesurfer, isReady } = useWavesurfer({
    container: containerRef,
    height: 60,
    waveColor: '#cbd5e1', // Unplayed bar color
    progressColor: '#3b82f6', // Moving progress bar color
    cursorColor: 'transparent', // Hides the vertical playhead line for a cleaner look
    barWidth: 3, // Turns the wave into vertical bars
    barGap: 2, // Space between bars
    barRadius: 3 // Rounded bar edges
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

    if (isPlaying) {
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '400px' }}>
      <div className={styles.audioBarPlayerControlsSection}>
        <div className={styles.audioBarPlayerControls}>
          <button className={styles.audioBarPlayerControlsButton} onClick={togglePlay} disabled={!isReady}>
            {!isPlaying ? <FaPlay /> : <FaPause />} {isPlaying ? 'Playing' : 'Play'}
          </button>
        </div>
      </div>

      <div className={styles.recordingCardControlsOptions}>
        <button className={styles.recordingCardControlsOptionsButton} onClick={handleOnEdit}>
          Rename
        </button>

        <button className={styles.recordingCardControlsOptionsButton} onClick={handleOnRemove}>
          Delete
        </button>
      </div>

      {/* WaveSurfer renders the bars inside this div */}
      <div ref={containerRef} style={{ flex: 1 }} />
    </div>
  )
}
