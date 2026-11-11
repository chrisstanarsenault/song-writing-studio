import Dexie from 'dexie'
import type { Song, SongTag, SongStatus } from '../globals/types/global-types.tsx'

export const db = new Dexie('song-library')

db.on('populate', (transaction) => {
  transaction.table('tags').bulkAdd([
    { id: crypto.randomUUID(), name: 'Pop', normalizedName: 'pop', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Rock', normalizedName: 'rock', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Indie', normalizedName: 'indie', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Acoustic', normalizedName: 'acoustic', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Electronic', normalizedName: 'electronic', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Voice memo', normalizedName: 'voice-memo', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Synth', normalizedName: 'synth', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Blues', normalizedName: 'blues', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Metal', normalizedName: 'metal', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Night', normalizedName: 'night', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Electric', normalizedName: 'electric', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Piano', normalizedName: 'piano', createdAt: new Date().toISOString() },
  ])
})

db.on('populate', (transaction) => {
  transaction.table('statuses').bulkAdd([
    { id: crypto.randomUUID(), name: 'Idea', normalizedName: 'idea', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'In progress', normalizedName: 'in-progress', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Completed', normalizedName: 'completed', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Archived', normalizedName: 'archived', createdAt: new Date().toISOString() },
  ])
})

db.version(1).stores({
  songs: 'id, title, sections, status, tags, lastEdited, takes, songKey, bpm, tuning, createdAt, notes',
  tags: 'id, name, normalizedName, createdAt',
  statuses: 'id, name, normalizedName, createdAt',
})

export const songsTable = db.table<Song, string>('songs')
export const songTagsTable = db.table<SongTag, string>('tags')
export const songStatusesTable = db.table<SongStatus, string>('statuses')
