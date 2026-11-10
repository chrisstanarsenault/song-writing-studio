import { songLibraryDb, songsTable } from './db'
import type { LyricsSection } from '../globals/types/global-types'

export async function updateSection (
  songId: string,
  editedSection: LyricsSection
): Promise<void> {
  await songLibraryDb.transaction('rw', songsTable, async () => {
    const song = await songsTable.get(songId)

    if (!song) {
      throw new Error('Song not found')
    }

    const sections = song.sections ?? []

    if (!sections.some(section => section.id === editedSection.id)) {
      throw new Error('Section not found')
    }

    await songsTable.update(songId, {
      sections: sections.map(section =>
        section.id === editedSection.id
          ? {
            ...editedSection,
            createdAt: section.createdAt,
            updatedAt: new Date().toISOString()
          }
          : section
      ),
      lastEdited: new Date().toISOString()
    })
  })
}
