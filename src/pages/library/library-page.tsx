import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'

import { songsTable, songTagsTable, songStatusesTable } from '../../lib/db.ts'

import type { Song, SongTag, SongStatus } from '../../globals/types/global-types.tsx'

import Header from '../../globals/components/header/header.tsx'

import styles from './library-page.module.css'

const LibraryPage = () => {
  const navigate = useNavigate()

  const [songs, setSongs] = useState<Song[]>([])
  const [tags, setTags] = useState<SongTag[]>([])
  const [statuses, setStatuses] = useState<SongStatus[]>([])

  useEffect(() => {
    const querySongs = async () => {
      const songs = await songsTable.toArray()
      setSongs(songs)
    }
    querySongs()

    const queryTags = async () => {
      const tags = await songTagsTable.toArray()
      setTags(tags)
    }
    queryTags()

    const queryStatuses = async () => {
      const statuses = await songStatusesTable.toArray()
      setStatuses(statuses)
    }
    queryStatuses()
  }, [])

  const newSongClick = () => {
    createNewSong()
  }

  const captureIdeaClick = () => {
    navigate('/song/new')
  }

  const createNewSong = async () => {
    const songId: string = crypto.randomUUID()

    const newSong: Song = {
      id: songId,
      title: 'Untitled song',
      sections: null,
      status: 'Idea',
      tags: null,
      lastEdited: new Date().toISOString(),
      takes: 0,
      songKey: null,
      bpm: null,
      tuning: null,
      createdAt: new Date().toISOString(),
      notes: null
    }

    try {
      await songsTable.add(newSong)

      navigate(`/song/${newSong.id}`)
    } catch (error) {
      console.error('Error adding song:', error)
    }
  }

  return (
    <div className={styles.background}>
      <Header
        title="Song Library"
        description="Your songs, words and melodies, together."
        buttons={[
          { title: '+ New song', type: 'primary', onClick: newSongClick },
          { title: 'Capture idea', type: 'secondary', onClick: captureIdeaClick }
        ]}
      />

      <section className={styles.grid_container}>
        <section className={styles.search_container}>
          <input type="text" placeholder="Search songs..." />

          <select id="status-select" name="status" aria-label="Status">
            <option value="all">All statuses</option>
            {statuses.map(status => (
              <option key={status.id} value={status.normalizedName}>
                {status.name}
              </option>
            ))}
          </select>

          <select id="tags-select" name="tags" aria-label="Tags">
            <option value="all">All tags</option>
            {tags.map(tag => (
              <option key={tag.id} value={tag.normalizedName}>
                {tag.name}
              </option>
            ))}
          </select>
        </section>

        <section className={styles.stats_container}>
          <div className={styles.stats_item}>
            <h4>Total songs</h4>
            <p>{songs.length}</p>
          </div>

          <div className={styles.stats_item}>
            <h4>In progress</h4>
            <p>{songs.filter(song => song.status === 'In progress').length}</p>
          </div>

          <div className={styles.stats_item}>
            <h4>Completed</h4>
            <p>{songs.filter(song => song.status === 'Completed').length}</p>
          </div>
        </section>

        <section className={styles.content_container}>
          <section className={styles.content}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Status</th>
                  <th scope="col">Tags</th>
                  <th scope="col">Last Edited</th>
                  <th scope="col">Takes</th>
                </tr>
              </thead>

              <tbody>
                {songs.map(song => {
                  return (
                    <tr key={song.id}>
                      <td>
                        <NavLink to={`/song/${song.id}`}>{song.title || 'Untitled song'}</NavLink>
                      </td>
                      <td>{song.status}</td>
                      <td>{song.tags?.join(', ') || 'No tags'}</td>
                      <td>{new Date(song.lastEdited).toLocaleDateString()}</td>
                      <td>{song.takes}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>

          <section className={styles.backup_container}>
            <h4>Your library, safe</h4>
            <p>Keep a complete copy of your lyrics, notes and audio.</p>

            <button>Export backup</button>
            <button>Import backup</button>
          </section>
        </section>
      </section>
    </div>
  )
}

export default LibraryPage
