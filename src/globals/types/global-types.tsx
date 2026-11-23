export interface LyricsSection {
  id: string
  title: string | null
  lyrics: string | null
  chords: string[]
  createdAt: string
  lastEdited: string
}

export type LyricsSectionFormData = Pick<LyricsSection, 'title' | 'chords' | 'lyrics' | 'id'>
export type RecordingFormData = Pick<
  RecordingDetails,
  'name' | 'songId' | 'sectionId' | 'source' | 'mimeType' | 'durationSeconds' | 'blob'
>

export type SongStatusType = 'Idea' | 'Completed' | 'Archived' | 'In progress'

export interface Song {
  id: string
  title: string
  sections: LyricsSection[]
  status: SongStatusType | null
  tags: string[]
  lastEdited: string
  takes: number
  songKey: string | null
  bpm: number | null
  tuning: string | null
  createdAt: string
  notes: string | null
}

export interface SongTag {
  id: string
  name: string
  normalizedName: string
  createdAt: string
}

export interface SongStatus {
  id: string
  name: SongStatusType
  normalizedName: string
  createdAt: string
}

export interface RecordingDetails {
  id: string
  songId: string
  sectionId: string | null // null means entire song
  name: string
  source: 'recorded' | 'uploaded'
  mimeType: string
  durationSeconds: number
  blob: Blob
  createdAt: string
  lastEdited: string
}

export interface RecordingAudio {
  recordingId: string
  audioBlob: Blob
}

export interface NotesDetails {
  id: string
  songId: string
  sectionId: string | null // null means entire song
  content: string
  createdAt: string
}

export interface RecordingFormInput {
  name: string
  songId: string | null
  sectionId: string | null
  source: string
  mimeType: string
  durationSeconds: number
  blob: Blob | null
}
