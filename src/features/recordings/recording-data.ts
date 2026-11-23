import { db, recordingDetailsTable, recordingAudioTable } from '#lib/db'
import type { RecordingFormInput, RecordingDetails, RecordingAudio } from '#globals/types/global-types'

export const addRecording = async (recordingDetails: RecordingFormInput): Promise<void> => {
  const now = new Date().toISOString()
  const recordingId = crypto.randomUUID()

  const addRecording: RecordingDetails = {
    id: recordingId,
    name: recordingDetails.name,
    songId: recordingDetails.songId ?? "",
    sectionId: recordingDetails.sectionId,
    source: recordingDetails.source as 'recorded' | 'uploaded' || "",
    mimeType: recordingDetails.mimeType,
    durationSeconds: recordingDetails.durationSeconds,
    blob: recordingDetails.blob,
    createdAt: now,
    lastEdited: now
  }

  const addAudio: RecordingAudio = {
    recordingId,
    audioBlob: recordingDetails.blob ?? new Blob(),
  }

  await db.transaction('rw', recordingDetailsTable, recordingAudioTable, async () => {
    await recordingDetailsTable.add(addRecording)
    await recordingAudioTable.add(addAudio)
  })
}
