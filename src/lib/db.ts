import Dexie from 'dexie'
import type { Song } from '../globals/types/global-types.tsx'

export const db = new Dexie('song-library')

db.version(1).stores({
  songs: 'id, title, sections, status, tags, lastEdited, takes, songKey, bpm, tuning, createdAt, notes',
})

export const songsTable = db.table<Song, string>('songs')
