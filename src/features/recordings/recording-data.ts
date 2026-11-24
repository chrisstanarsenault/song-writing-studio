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
    blob: recordingDetails.blob ?? new Blob(),
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

export const deleteRecording = async (recordingId: string): Promise<void> => {
  await db.transaction('rw', recordingDetailsTable, recordingAudioTable, async () => {
    await recordingDetailsTable.delete(recordingId)
    await recordingAudioTable.delete(recordingId)
  })
}

export const updateRecording = async (recordingId: string, input: RecordingFormInput): Promise<void> => {
  if (!input.blob || input.blob.size === 0) {
    throw new Error('Blob is required')
  }

  await db.transaction('rw', recordingDetailsTable, recordingAudioTable, async () => {
    const detailsCount = await recordingDetailsTable.update(recordingId, {
      name: input.name.trim() || 'Untitled recording',
      songId: input.songId ?? "",
      sectionId: input.sectionId,
      source: input.source as 'recorded' | 'uploaded' || "",
      mimeType: input.mimeType,
      durationSeconds: input.durationSeconds,
      lastEdited: new Date().toISOString(),
    })

    const audioCount = await recordingAudioTable.update(recordingId, {
      audioBlob: input.blob ?? new Blob(),
    })

    if (detailsCount === 0 || audioCount === 0) {
      throw new Error('Recording not found')
    }
  })
}
