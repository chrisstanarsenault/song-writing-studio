// In a song data helper file
import { db, songsTable } from './db'
import type { LyricsSection } from '#globals/types/global-types'

export async function addSection (
  songId: string,
  newSection: LyricsSection
): Promise<void> {
  await db.transaction('rw', songsTable, async () => {
    const latestSong = await songsTable.get(songId)

    if (!latestSong) {
      throw new Error('Song not found')
    }

    await songsTable.update(songId, {
      sections: [...(latestSong.sections ?? []), newSection],
      lastEdited: new Date().toISOString()
    })
  })
}
