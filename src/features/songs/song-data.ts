import { db, songsTable } from '#lib/db'
import type { LyricsSection, LyricsSectionFormData, Song } from '#globals/types/global-types.tsx'

export const createSong = async (): Promise<void> => {
  const now = new Date().toISOString()

  const newSong: Song = {
    id: crypto.randomUUID(),
    title: 'Untitled song',
    sections: [],
    status: 'Idea',
    tags: [],
    lastEdited: now,
    takes: 0,
    songKey: null,
    bpm: null,
    tuning: null,
    createdAt: now,
    notes: null
  }

  await songsTable.add(newSong)
}

export const addSection = async (songId: string, section: LyricsSectionFormData): Promise<void> => {
  await db.transaction('rw', songsTable, async () => {
    const song = await songsTable.get(songId)

    if (!song) {
      throw new Error('Song not found')
    }

    const now = new Date().toISOString()

    const newSection: LyricsSection = {
      ...section,
      createdAt: now,
      lastEdited: now
    }

    await songsTable.update(songId, {
      sections: [...(song.sections ?? []), newSection],
      lastEdited: now
    })
  })
}

export const updateSection = async (songId: string, editedSection: LyricsSectionFormData): Promise<void> => {
  await db.transaction('rw', songsTable, async () => {
    const song = await songsTable.get(songId)

    if (!song) {
      throw new Error('Song not found')
    }

    const sections = song?.sections ?? []
    const index = sections.findIndex(section => section.id === editedSection.id)

    if (index === -1) {
      throw new Error('Section not found')
    }

    const now = new Date().toISOString()

    // Create a new array with the updated section
    const updatedSections = [...sections]
    updatedSections[index] = {
      ...editedSection,
      createdAt: sections[index].createdAt,
      lastEdited: now
    }

    await songsTable.update(songId, {
      sections: updatedSections,
      lastEdited: now
    })
  })
}

export const moveSectionUp = (async (songId: string, sectionId: string) => {
  await db.transaction('rw', songsTable, async () => {
    const song = await songsTable.get(songId)

    if (!song) {
      throw new Error('Song not found')
    }

    const sections = song?.sections ?? []
    const sectionIndex = sections.findIndex(section => section.id === sectionId)

    if (sectionIndex === -1) {
      throw new Error('Section not found')
    }

    // If the section is already at the top, do nothing
    if (sectionIndex === 0) return

    // Swap the section with the one above it
    const newSections = [...sections]
    const temp = newSections[sectionIndex]

    newSections[sectionIndex] = newSections[sectionIndex - 1]
    newSections[sectionIndex - 1] = temp

    await songsTable.update(song.id, {
      sections: newSections,
      lastEdited: new Date().toISOString()
    })
  })
})

export const moveSectionDown = (async (songId: string, sectionId: string) => {
  await db.transaction('rw', songsTable, async () => {
    const song = await songsTable.get(songId)

    if (!song) {
      throw new Error('Song not found')
    }

    const sections = song.sections ?? []
    const sectionIndex = sections.findIndex(section => section.id === sectionId)

    if (sectionIndex === -1) {
      throw new Error('Section not found')
    }

    // If the section is already at the bottom, do nothing
    if (sectionIndex === sections.length - 1) return

    const newSections = [...sections]
    const temp = newSections[sectionIndex]

    // Swap the section with the one below it
    newSections[sectionIndex] = newSections[sectionIndex + 1]
    newSections[sectionIndex + 1] = temp

    await songsTable.update(song.id, {
      sections: newSections,
      lastEdited: new Date().toISOString()
    })
  })
})

export const deleteSection = (async (songId: string, sectionId: string) => {
  await db.transaction('rw', songsTable, async () => {
    const song = await songsTable.get(songId)

    if (!song) {
      throw new Error('Song not found')
    }

    const sections = song.sections ?? []
    const sectionIndex = sections.findIndex(section => section.id === sectionId)

    if (sectionIndex === -1) {
      throw new Error('Section not found')
    }

    // Remove the section from the sections array
    const newSections = [...sections]
    newSections.splice(sectionIndex, 1)

    await songsTable.update(song.id, {
      sections: newSections,
      lastEdited: new Date().toISOString()
    })
  })
})
