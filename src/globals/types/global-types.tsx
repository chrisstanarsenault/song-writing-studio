export type LyricSectionType = 'Verse' | 'Chorus' | 'Bridge' | 'Outro' | 'Instrumental' | 'Intro' | 'Custom'
export type SongStatus = 'Idea' | 'In Progress' | 'Completed' | 'Archived'

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
