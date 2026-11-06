import Dexie from 'dexie'
import type { Song, SongTag, SongStatus } from '../globals/types/global-types.tsx'

export const songLibraryDb = new Dexie('song-library')
export const songTagsDb = new Dexie('song-tags')
export const songStatusesDb = new Dexie('song-statuses')

songTagsDb.on('populate', (transaction) => {
  transaction.table('tags').bulkPut([
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

songStatusesDb.on('populate', (transaction) => {
  transaction.table('statuses').bulkPut([
    { id: crypto.randomUUID(), name: 'Idea', normalizedName: 'idea', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'In progress', normalizedName: 'in-progress', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Completed', normalizedName: 'completed', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Archived', normalizedName: 'archived', createdAt: new Date().toISOString() },
  ])
})

songLibraryDb.version(1).stores({
  songs: 'id, title, sections, status, tags, lastEdited, takes, songKey, bpm, tuning, createdAt, notes',
})

songTagsDb.version(1).stores({
  tags: 'id, name, normalizedName, createdAt',
})

songStatusesDb.version(1).stores({
  statuses: 'id, name, normalizedName, createdAt',
})

export const songsTable = songLibraryDb.table<Song, string>('songs')
export const songTagsTable = songTagsDb.table<SongTag, string>('tags')
export const songStatusesTable = songStatusesDb.table<SongStatus, string>('statuses')
