import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { useLiveQuery } from 'dexie-react-hooks'

import Header from '../../globals/components/header/header'
import { EditSongDetailsModal } from './components/edit-song-modal/edit-song-details-modal.tsx'
import { NewLyricModal } from './components/new-lyric-modal/new-lyric-modal.tsx'
import { LyricContainer } from './components/lyric-container/lyric-container.tsx'

import { songsTable, songStatusesTable, songTagsTable } from '../../lib/db.ts'

import type { SongStatus, SongTag, LyricsSection } from '../../globals/types/global-types.tsx'

import styles from './song-page.module.css'

const SongPage = () => {
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [isAddingNewLyric, setIsAddingNewLyric] = useState(false)

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

  const handleSaveNewLyricsSection = async (formData: LyricsSection) => {
    try {
      const updatedCount = await songsTable.update(song?.id || '', {
        sections: [...(song?.sections ?? []), formData]
      })

      if (updatedCount) {
        setIsAddingNewLyric(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleMoveDown = (id: string) => {
    const sectionIndex = song?.sections?.findIndex(section => section.id === id)

    if (
      sectionIndex === undefined ||
      sectionIndex === null ||
      (song?.sections?.length && sectionIndex === song?.sections?.length - 1)
    )
      return

    const newSections = [...(song?.sections ?? [])]
    const temp = newSections[sectionIndex]

    newSections[sectionIndex] = newSections[sectionIndex + 1]
    newSections[sectionIndex + 1] = temp

    songsTable.update(song?.id || '', { sections: newSections })
  }

  const handleMoveUp = (id: string) => {
    const sectionIndex = song?.sections?.findIndex(section => section.id === id)

    if (sectionIndex === undefined || sectionIndex === null || (song?.sections?.length && sectionIndex === 0)) return

    const newSections = [...(song?.sections ?? [])]
    const temp = newSections[sectionIndex]

    newSections[sectionIndex] = newSections[sectionIndex - 1]
    newSections[sectionIndex - 1] = temp

    songsTable.update(song?.id || '', { sections: newSections })
  }

  const handleEdit = (id: string) => {
    console.log('Edit', id)
  }

  const handleDelete = (id: string) => {
    const selectionIndex = song?.sections?.findIndex(section => section.id === id)

    if (selectionIndex === undefined || selectionIndex === null) return

    const newSections = [...(song?.sections ?? [])]
    newSections.splice(selectionIndex, 1)

    songsTable.update(song?.id || '', { sections: newSections })
  }

  const handleRecordingNotes = (id: string) => {
    console.log('Recording notes', id)
  }

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
          setIsEditingDetails(!isEditingDetails)
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
            {song?.sections?.map(section => (
              <LyricContainer
                key={section.id}
                {...section}
                onMoveDown={() => handleMoveDown(section.id)}
                onMoveUp={() => handleMoveUp(section.id)}
                onEdit={() => handleEdit(section.id)}
                onDelete={() => handleDelete(section.id)}
                onRecordingNotes={() => handleRecordingNotes(section.id)}
              />
            ))}

            <button type="button" className={styles.addAnotherSectionButton} onClick={() => setIsAddingNewLyric(true)}>
              Add another section
            </button>
          </section>

          <section className={styles.recordingContainer}>
            <p>Recording</p>
          </section>
        </section>
      </section>

      {isEditingDetails && (
        <EditSongDetailsModal
          onClose={() => setIsEditingDetails(false)}
          songId={song?.id || ''}
          details={details}
          tagsList={tags || []}
          statusList={statuses || []}
        />
      )}

      {isAddingNewLyric && (
        <NewLyricModal
          onClose={() => setIsAddingNewLyric(false)}
          onSave={formData => {
            handleSaveNewLyricsSection(formData)
          }}
          sectionDetails={{}}
        />
      )}
    </div>
  )
}

export default SongPage
