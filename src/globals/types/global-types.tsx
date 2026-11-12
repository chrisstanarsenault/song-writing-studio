export interface LyricsSection {
  id: string
  title: string
  lyrics: string
  chords: string[]
  createdAt: string
  lastEdited: string
}

export type LyricsSectionFormData = Pick<LyricsSection, 'title' | 'chords' | 'lyrics' | 'id'>

export interface Song {
  id: string
  title: string
  sections: LyricsSection[] | null
  status: string
  tags: string[] | null
  lastEdited: string
  takes: number
  songKey: string | null
  bpm: number | null
  tuning: string | null
  createdAt: string
  notes: string | null
}

export interface AudioTake {
  id: string
  songId: number
  sectionId: string | null // null means entire song
  name: string
  source: 'recorded' | 'uploaded'
  blob: Blob
  mimeType: string
  durationSeconds: number | null
  createdAt: number
}

export interface SongTag {
  id: string
  name: string
  normalizedName: string
  createdAt: string
}

export interface SongStatus {
  id: string
  name: string
  normalizedName: string
  createdAt: string
}

export interface RecordingDetails {
  id: string
  songId: string
  sectionId: string | null // null means entire song
  name: string
  duration: number | null
  createdAt: string
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
