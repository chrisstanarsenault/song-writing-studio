import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'

import Header from '../../globals/components/header/header'
import { EditSongDetailsModal } from './components/edit-song-details-modal.tsx'

import { songsTable } from '../../lib/db.ts'

import type { Song } from '../../globals/types/global-types.tsx'

import styles from './song-page.module.css'

const SongPage = () => {
  const [song, setSong] = useState<Song | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [songDetails, setSongDetails] = useState<Song | null>(null)
  const [tagsList, setTagsList] = useState<string[] | null>([])

  const { songId } = useParams()

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

  const formatSongNameForDisplay = (songName: string) => {
    return songName.replace(/_/g, ' ')
  }

  const formatSongNameForStorage = (songName: string) => {
    return songName.replace(/ /g, '_')
  }

  useEffect(() => {
    const querySongs = async () => {
      const songs = await songsTable.toArray()
      const tags = songs.map((song: Song) => song.tags).flat()
      const uniqueTags = [...new Set(tags)]
      setTagsList(uniqueTags as string[])

      const song = songs.find((song: Song) => song.title === songId)

      setSong(song || null)
    }
    querySongs()
  }, [songId])

  if (!song) {
    return <p>Loading...</p>
  }

  return (
    <div className={styles.background}>
      <Header
        title={formatSongNameForDisplay(song?.title || 'Untitled songs')}
        description={song?.status || 'Ideas'}
        editIcon={true}
        editIconOnClick={() => {
          setIsEditing(!isEditing)
          setSongDetails({ ...song })
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

      <section className={styles.songDetailsContainer}>
        <section className={styles.songDetailsSection}>
          <div>
            <p>KEY</p>
            {!isEditing ? (
              <p>{songDetails?.songKey || 'Unknown'}</p>
            ) : (
              <input
                value={songDetails?.songKey ?? ''}
                onChange={event => {
                  const value = event.target.value

                  setSongDetails(previous =>
                    previous ? { ...previous, songKey: value === '' ? null : value } : previous
                  )
                }}
              />
            )}
          </div>

          <div>
            <p>BPM</p>
            {!isEditing ? (
              <p>{songDetails?.bpm || 'Unknown'}</p>
            ) : (
              <input
                type="number"
                value={songDetails?.bpm ?? ''}
                onChange={event => {
                  const value = event.target.value

                  setSongDetails(previous =>
                    previous ? { ...previous, bpm: value === '' ? null : Number(value) } : previous
                  )
                }}
              />
            )}
          </div>

          <div>
            <p>Tuning</p>
            {!isEditing ? (
              <p>{songDetails?.tuning || 'Unknown'}</p>
            ) : (
              <input
                value={songDetails?.tuning ?? ''}
                onChange={event => {
                  const value = event.target.value

                  setSongDetails(previous =>
                    previous ? { ...previous, tuning: value === '' ? null : value } : previous
                  )
                }}
              />
            )}
          </div>
        </section>

        <section className={styles.songDetailsSection}>
          <div>
            <p>Tags</p>
            {!isEditing ? (
              <p>{songDetails?.tags?.join(', ') || 'No tags'}</p>
            ) : (
              <select>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            )}
          </div>

          <div>
            <p>Status</p>
            <select>
              <option value="idea">Idea</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </section>
      </section>

      {isEditing && (
        <EditSongDetailsModal
          onClose={() => setIsEditing(false)}
          details={details}
          tagsList={tagsList || []}
          onSave={() => {}}
        />
      )}
    </div>
  )
}

export default SongPage
