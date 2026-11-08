export type LyricSectionType = 'Verse' | 'Chorus' | 'Bridge' | 'Outro' | 'Instrumental' | 'Intro' | 'Custom'
// export type SongStatus = 'Idea' | 'In Progress' | 'Completed' | 'Archived'

export interface LyricSection {
  id: string
  type: LyricSectionType
  title: string
  lyrics: string
  chords: string
}

export interface Song {
  id: string
  title: string
  sections: LyricSection[] | null
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
