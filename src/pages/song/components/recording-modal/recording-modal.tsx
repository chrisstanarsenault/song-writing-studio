import { useId, useRef, useState, useEffect } from 'react'

import type { RecordingFormInput } from '#globals/types/global-types'

import { Modal } from '#globals/components/modal-portal/modal-portal'
import { GlobalButton } from '#globals/components/global-button/global-button'

import styles from './recording-modal.module.css'

type RecordingModalProps = {
  songId: string
  sectionId: string | null
  handleSubmit: (recordingFormInput: RecordingFormInput) => Promise<void>
  onClose: () => void
}
type RecordingStatus = 'idle' | 'requesting' | 'recording' | 'stopping' | 'preview' | 'error'

interface RecorderControls {
  start: () => void
  stop: () => Promise<{ audioBlob: Blob; audioUrl: string }>
}

export const RecordingModal = ({ songId, sectionId, handleSubmit, onClose }: RecordingModalProps) => {
  const recorderRef = useRef<RecorderControls | null>(null)
  const startedAtRef = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [status, setStatus] = useState<RecordingStatus>('idle')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [recordingError, setRecordingError] = useState<string | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [formData, setFormData] = useState<RecordingFormInput>({
    name: '',
    songId: songId,
    sectionId: sectionId,
    source: 'recorded',
    mimeType: '',
    durationSeconds: 0,
    blob: null
  })

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const titleId = useId()

  const setupAudioRecorder = async (): Promise<RecorderControls> => {
    // 1. Request microphone access from the user
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // 2. Initialize the MediaRecorder with the audio stream
    const mediaRecorder = new MediaRecorder(stream)
    let audioChunks: Blob[] = []

    // 3. Collect audio data chunks as they become available
    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunks.push(event.data)
      }
    }

    // 4. Return start and stop functions
    const start = () => {
      audioChunks = [] // reset chunks for a fresh recording
      mediaRecorder.start()
      startedAtRef.current = performance.now()
      setRecordingDuration(0)

      timerRef.current = setInterval(() => {
        const startedAt = startedAtRef.current

        if (startedAt === null) return

        setRecordingDuration((performance.now() - startedAt) / 1000)
      }, 250)
    }

    const stop = () => {
      return new Promise<{ audioBlob: Blob; audioUrl: string }>(resolve => {
        if (timerRef.current !== null) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }

        if (startedAtRef.current !== null) {
          setRecordingDuration((performance.now() - startedAtRef.current) / 1000)
          startedAtRef.current = null
        }

        mediaRecorder.onstop = () => {
          // combine chunks into a single audio blob and generable a playable url
          const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType })
          const audioUrl = URL.createObjectURL(audioBlob)

          // Stop all microphone tracks to turn off the browser's recording indicator
          stream.getTracks().forEach(track => track.stop())

          resolve({ audioBlob, audioUrl })
        }
        mediaRecorder.stop()
      })
    }

    return { start, stop }
  }

  const startRecording = async () => {
    if (status !== 'idle' && status !== 'error') return

    setStatus('requesting')
    setRecordingError(null)

    try {
      const controls = await setupAudioRecorder()

      recorderRef.current = controls
      controls.start()

      setStatus('recording')
    } catch (error) {
      console.error('Error starting recording:', error)
      setRecordingError("Couldn't start recording.  Check microphone access.")
      setStatus('error')
    }
  }

  const stopRecording = async () => {
    const controls = recorderRef.current

    if (!controls || status !== 'recording') return

    setStatus('stopping')

    try {
      const { audioBlob, audioUrl } = await controls.stop()

      setFormData(previous => ({ ...previous, blob: audioBlob }))
      setPreviewUrl(audioUrl)
      recorderRef.current = null
      setStatus('preview')
    } catch (error) {
      console.error('error stopping recording:', error)
      setRecordingError("Couldn't finish the recording.")
      setStatus('error')
    }
  }

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (typeof formData.name !== 'string' || !formData.blob) {
      console.log('error')
      setRecordingError('Please enter a name and record audio.')
      return
    }

    const recordingDetails: RecordingFormInput = {
      name: formData.name.trim() || 'Untitled Recording',
      songId,
      sectionId,
      source: 'recorded',
      mimeType: formData.blob?.type || '',
      durationSeconds: recordingDuration,
      blob: formData.blob
    }

    try {
      await handleSubmit(recordingDetails)
    } catch (error) {
      console.error('error submitting form:', error)
      setRecordingError('Failed to save recording.')
      setStatus('error')
    }
  }

  return (
    <Modal titleId={titleId} onClose={onClose}>
      <div>
        <h2>New Recording</h2>

        <form onSubmit={handleSubmitForm} className={styles.recordingForm}>
          <input
            type="text"
            name="name"
            placeholder="Name your recording..."
            onChange={event => setFormData({ ...formData, name: event.target.value })}
          />

          <div className={styles.recordingButtonsContainer}>
            <button
              type="button"
              onClick={startRecording}
              disabled={status !== 'idle' && status !== 'error'}
              className={styles.startRecordingButton}
            >
              {status === 'requesting'
                ? 'Requesting microphone...'
                : status === 'recording'
                  ? 'Recording...'
                  : 'Start Recording'}
            </button>

            <button type="button" onClick={stopRecording} className={styles.stopRecordingButton}>
              Stop
            </button>
          </div>

          {previewUrl && <audio controls src={previewUrl} />}

          <GlobalButton type="submit" variant="primary" disabled={status !== 'preview'}>
            Save Recording
          </GlobalButton>
        </form>
      </div>
    </Modal>
  )
}
