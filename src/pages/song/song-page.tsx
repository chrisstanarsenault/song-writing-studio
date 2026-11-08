import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { useLiveQuery } from 'dexie-react-hooks'

import Header from '../../globals/components/header/header'
import { EditSongDetailsModal } from './components/edit-song-modal/edit-song-details-modal.tsx'
import { LyricContainer } from './components/lyric-container/lyric-container.tsx'

import { songsTable, songStatusesTable, songTagsTable } from '../../lib/db.ts'

import type { SongStatus, SongTag } from '../../globals/types/global-types.tsx'

import styles from './song-page.module.css'

const SongPage = () => {
  const [isEditing, setIsEditing] = useState(false)

  const { songId } = useParams()

  const song = useLiveQuery(async () => {
    if (!songId) return null

    return (await songsTable.get(songId)) ?? null
  }, [songId])

  const statuses = useLiveQuery(async () => {
    const statuses = await songStatusesTable.toArray()

    return statuses.map((status: SongStatus) => status.name)
  }, [])

  const tags = useLiveQuery(async () => {
    const tags = await songTagsTable.toArray()

    return tags.map((tag: SongTag) => tag.name)
  }, [])

  const details = useMemo(() => {
    return {
      title: song?.title || 'Untitled song',
      songKey: song?.songKey || 'Unknown',
      bpm: song?.bpm || 0,
      tuning: song?.tuning || 'Unknown',
      tags: song?.tags || [],
      status: song?.status || 'Idea'
    }
  }, [song])

  return (
    <div className={styles.background}>
      <Header
        title={song?.title || 'Untitled song'}
        description={song?.status || 'Ideas'}
        editIcon={true}
        editIconOnClick={() => {
          setIsEditing(!isEditing)
        }}
        buttons={[
          {
            title: 'Record idea',
            type: 'primary',
            onClick: () => {
              console.log('Record idea')
            }
          }
        ]}
      />

      <section className={styles.fullSongContainer}>
        <div className={styles.songDetailsContainer}>
          <section className={styles.songDetailsSection}>
            <div>
              <p>KEY</p>
              <p>{song?.songKey || 'Unknown'}</p>
            </div>

            <div>
              <p>BPM</p>
              <p>{song?.bpm || 'Unknown'}</p>
            </div>

            <div>
              <p>Tuning</p>
              <p>{song?.tuning || 'Unknown'}</p>
            </div>
          </section>

          <section className={styles.songDetailsSection}>
            <div>
              <p>Tags</p>
              <p>{song?.tags?.join(', ') || 'No tags'}</p>
            </div>

            <div>
              <p>Status</p>
              <p>{song?.status || 'Unknown'}</p>
            </div>
          </section>
        </div>

        <section className={styles.lyricsRecordingContainer}>
          <section className={styles.lyricsContainer}>
            <LyricContainer />
          </section>

          <section className={styles.recordingContainer}>
            <p>Recording</p>
          </section>
        </section>
      </section>

      {isEditing && (
        <EditSongDetailsModal
          onClose={() => setIsEditing(false)}
          songId={song?.id || ''}
          details={details}
          tagsList={tags || []}
          statusList={statuses || []}
        />
      )}
    </div>
  )
}

export default SongPage
