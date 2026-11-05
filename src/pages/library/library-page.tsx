import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'

import { songsTable } from '../../lib/db.ts'

import type { Song } from '../../globals/types/global-types.tsx'

import Header from '../../globals/components/header/header.tsx'

import styles from './library-page.module.css'

const LibraryPage = () => {
  const navigate = useNavigate()

  const [songs, setSongs] = useState<Song[]>([])

  useEffect(() => {
    const querySongs = async () => {
      const songs = await songsTable.toArray()
      setSongs(songs)
    }
    querySongs()
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
      console.log('Pre Adding song:', newSong)
      await songsTable.add(newSong)
      console.log('Post Adding song:', newSong)
      console.log('Song Fetch:', await songsTable.get(songId))

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
            <option value="idea">Idea</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>

          <select id="tags-select" name="tags" aria-label="Tags">
            <option value="all">All tags</option>
            <option value="tag1">Tag 1</option>
            <option value="tag2">Tag 2</option>
            <option value="tag3">Tag 3</option>
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
                        <NavLink to={`/song/${song.title}`}>{song.title}</NavLink>
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
