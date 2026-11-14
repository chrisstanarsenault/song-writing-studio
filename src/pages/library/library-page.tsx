import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useLiveQuery } from 'dexie-react-hooks'
import { toast } from 'react-toastify'

import { songsTable, songTagsTable, songStatusesTable } from '#lib/db.ts'

import type { Song, SongTag, SongStatus } from '#globals/types/global-types.tsx'

import Header from '#globals/components/header/header.tsx'
import { GlobalButton } from '#globals/components/global-button/global-button.tsx'

import styles from './library-page.module.css'

const LibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')

  const navigate = useNavigate()

  const songs = useLiveQuery(async () => {
    return await songsTable.toArray()
  }, [])

  const tags = useLiveQuery(async () => {
    const tagList = await songTagsTable.toArray()
    return tagList.map((tag: SongTag) => tag)
  }, [])

  const statuses = useLiveQuery(async () => {
    const statusList = await songStatusesTable.toArray()
    return statusList.map((status: SongStatus) => status)
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
      sections: [],
      status: 'Idea',
      tags: [],
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
      toast.error('Error adding song: ' + error)
      console.error('Error adding song: ' + error)
      throw error
    }
  }

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value)
  }

  const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTag(event.target.value)
  }

  const filteredSongs = songs?.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    const matchesStatus = selectedStatus === 'all' || song.status === selectedStatus
    const matchesTags = selectedTag === 'all' || song.tags.includes(selectedTag)

    console.log(matchesSearch, matchesStatus, matchesTags)
    console.log('song', song.title)

    return matchesSearch && matchesStatus && matchesTags
  })

  if (!songs || !statuses || !tags) {
    return (
      <div>
        <div>Loading your library...</div>
      </div>
    )
  }

  return (
    <div className={styles.background}>
      <Header
        title="Song Library"
        description="Your songs, words and melodies, together."
        buttons={[
          { title: '+ New song', variant: 'primary', onClick: newSongClick },
          { title: 'Capture idea', variant: 'secondary', onClick: captureIdeaClick }
        ]}
      />

      <section className={styles.grid_container}>
        <section className={styles.search_container}>
          <input
            type="text"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
          />

          <select id="status-select" name="status" aria-label="Status" onChange={handleStatusChange}>
            <option value="all">All statuses</option>
            {statuses.map(status => (
              <option key={status.id} value={status.name}>
                {status.name}
              </option>
            ))}
          </select>

          <select id="tags-select" name="tags" aria-label="Tags" onChange={handleTagChange}>
            <option value="all">All tags</option>
            {tags.map(tag => (
              <option key={tag.id} value={tag.name}>
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
            {!songs.length ? (
              <section className={styles.no_songs_container}>
                <h4>No songs found</h4>
                <p>Create a new song to get started.</p>

                <GlobalButton variant="primary" onClick={newSongClick}>
                  Create new song
                </GlobalButton>
              </section>
            ) : (
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

                <tbody className={styles.content_table_body}>
                  {filteredSongs?.map(song => {
                    return (
                      <tr key={song.id} className={styles.content_table_row}>
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
            )}
          </section>

          <section className={styles.backup_container}>
            <h4>Your library, safe</h4>
            <p>Keep a complete copy of your lyrics, notes and audio.</p>

            <GlobalButton variant="primary" onClick={() => {}}>
              Export backup
            </GlobalButton>

            <GlobalButton variant="secondary" onClick={() => {}}>
              Import backup
            </GlobalButton>
          </section>
        </section>
      </section>
    </div>
  )
}

export default LibraryPage
