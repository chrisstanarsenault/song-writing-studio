import { notesTable } from '#lib/db'
import type { NotesDetails, CreateNoteInput, NoteFormInput } from '#globals/types/global-types'

export const addNote = async (input: CreateNoteInput): Promise<void> => {
  if (!input.songId) {
    throw new Error('Song ID is required')
  }

  if (!input.name) {
    throw new Error('Name is required')
  }

  if (!input.content) {
    throw new Error('Content is required')
  }

  const now = new Date().toISOString()
  const noteId = crypto.randomUUID()

  const addNote: NotesDetails = {
    id: noteId,
    name: input.name.trim() || 'Untitled note',
    songId: input.songId,
    sectionId: input.sectionId ?? null,
    content: input.content,
    createdAt: now,
    lastEdited: now
  }

  await notesTable.add(addNote)
}

export const deleteNote = async (noteId: string): Promise<void> => {
  if (!noteId) {
    throw new Error('Note ID is required')
  }

  await notesTable.delete(noteId)
}

export const updateNote = async (noteId: string, input: NoteFormInput): Promise<void> => {
  if (!noteId) {
    throw new Error('Note ID is required')
  }

  if (!input.content) {
    throw new Error('Content is required')
  }

  const detailsCount = await notesTable.update(noteId, {
    name: input.name.trim() || 'Untitled note',
    content: input.content,
    lastEdited: new Date().toISOString(),
  })

  if (detailsCount === 0) {
    throw new Error('Note not found')
  }
}
