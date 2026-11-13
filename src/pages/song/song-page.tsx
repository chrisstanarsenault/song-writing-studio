import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { useLiveQuery } from 'dexie-react-hooks'
import { toast } from 'react-toastify'
import { Link } from 'react-router'

import Header from '#globals/components/header/header'
import { GlobalButton } from '#globals/components/global-button/global-button.tsx'
import { EditSongDetailsModal } from './components/edit-song-modal/edit-song-details-modal.tsx'
import { LyricSectionModal } from './components/lyric-section-modal/lyric-section-modal.tsx'
import { LyricContainer } from './components/lyric-container/lyric-container.tsx'

import { songsTable, songStatusesTable, songTagsTable } from '#lib/db.ts'
import { moveSectionUp, moveSectionDown, deleteSection, addSection, updateSection } from '#features/songs/song-data.ts'

import type { LyricsSectionFormData } from '#globals/types/global-types.tsx'

import styles from './song-page.module.css'

type SectionModalState = { mode: 'create' } | { mode: 'edit'; sectionId: string } | null

const SongPage = () => {
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [lyricModalState, setLyricModalState] = useState<SectionModalState>(null)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)

  const { songId } = useParams()

  const pageResult = useLiveQuery(async () => {
    try {
      const [song, tagRecords, statusRecords] = await Promise.all([
        songId ? songsTable.get(songId) : Promise.resolve(undefined),
        songTagsTable.toArray(),
        songStatusesTable.toArray()
      ])

      return {
        status: 'success' as const,
        song: song ?? null,
        tags: tagRecords.map(tag => tag.name),
        statuses: statusRecords.map(status => status.name)
      }
    } catch (error) {
      console.log('Failed to load song:', error)

      return {
        status: 'error' as const
      }
    }
  }, [songId])

  const song = pageResult?.status === 'success' ? pageResult.song : null

  const handleSaveNewLyricsSection = async (formData: LyricsSectionFormData): Promise<void> => {
    try {
      if (!song) throw new Error('Song not found')

      await addSection(song.id, formData)

      setLyricModalState(null)
    } catch (error) {
      toast.error('Failed to add new section')
      throw error
    }
  }

  const handleMoveDown = async (sectionId: string) => {
    try {
      if (!song) throw new Error('Song not found')

      await moveSectionDown(song.id, sectionId)
    } catch (error) {
      toast.error('Failed to move section up or down')
      throw error
    }
  }

  const handleMoveUp = async (sectionId: string) => {
    try {
      if (!song) throw new Error('Song not found')

      await moveSectionUp(song.id, sectionId)
    } catch (error) {
      toast.error('Failed to move section up or down')
      throw error
    }
  }

  const editingSection =
    lyricModalState?.mode === 'edit'
      ? song?.sections?.find(section => section.id === lyricModalState.sectionId)
      : undefined

  const handleEdit = (id: string) => {
    setLyricModalState({ mode: 'edit', sectionId: id })
  }

  const handleSaveEditedSection = async (formData: LyricsSectionFormData) => {
    try {
      if (!song) throw new Error('Song not found')

      await updateSection(song.id, formData)
    } catch (error) {
      toast.error('Failed to update section')
      throw error
    }
  }

  const handleDelete = async (sectionId: string) => {
    try {
      if (!song) throw new Error('Song not found')

      await deleteSection(song.id, sectionId)
    } catch (error) {
      toast.error('Failed to delete section')
      throw error
    }
  }

  const handleSelectSection = (id: string) => {
    if (selectedSectionId === id) {
      setSelectedSectionId(null)
    } else {
      setSelectedSectionId(id)
    }
  }

  const handleRecordingNotes = (id: string) => {
    console.log('Recording notes', id)
  }

  const details = useMemo(() => {
    return {
      title: song?.title || '',
      songKey: song?.songKey || null,
      bpm: song?.bpm || null,
      tuning: song?.tuning || null,
      tags: song?.tags || [],
      status: song?.status || 'Idea'
    }
  }, [song])

  if (pageResult === undefined) return <p role="status">Loading...</p>

  if (pageResult.status === 'error') {
    return (
      <div role="alert">
        <p>Couldn't load this song. Please reload to try again.</p>
      </div>
    )
  }

  if (!song) {
    return (
      <div>
        <p>Song not found.</p>
        <Link to="/">Return to library</Link>
      </div>
    )
  }
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
            variant: 'primary',
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
              <p>{song?.songKey || 'Unknown key'}</p>
            </div>

            <div>
              <p>BPM</p>
              <p>{song?.bpm || 'No BPM set'}</p>
            </div>

            <div>
              <p>Tuning</p>
              <p>{song?.tuning || 'No tuning set'}</p>
            </div>
          </section>

          <section className={styles.songDetailsSection}>
            <div>
              <p>Tags</p>
              <p>{song?.tags?.join(', ') || 'No tags'}</p>
            </div>

            <div>
              <p>Status</p>
              <p>{song?.status || 'Unknown song status'}</p>
            </div>
          </section>
        </div>

        <section className={styles.lyricsRecordingContainer}>
          <section className={styles.lyricsContainer}>
            {song?.sections?.map(section => (
              <LyricContainer
                key={section.id}
                {...section}
                isSelected={section.id === selectedSectionId}
                onSelect={() => handleSelectSection(section.id)}
                onMoveDown={() => handleMoveDown(section.id)}
                onMoveUp={() => handleMoveUp(section.id)}
                onEdit={() => handleEdit(section.id)}
                onDelete={() => handleDelete(section.id)}
                onRecordingNotes={() => handleRecordingNotes(section.id)}
              />
            ))}

            <GlobalButton variant="primary" onClick={() => setLyricModalState({ mode: 'create' })}>
              Add another section
            </GlobalButton>
          </section>

          <section className={styles.recordingContainer}>
            <p>Recording</p>
          </section>
        </section>
      </section>

      {isEditingDetails && (
        <EditSongDetailsModal
          onClose={() => setIsEditingDetails(false)}
          songId={song.id}
          details={details}
          tagsList={pageResult.tags}
          statusList={pageResult.statuses}
        />
      )}

      {lyricModalState &&
        (lyricModalState && lyricModalState.mode === 'edit' && !editingSection ? (
          <div role="alert">
            <p>This section no longer exists.</p>
            <GlobalButton variant="primary" onClick={() => setLyricModalState(null)}>
              Dismiss
            </GlobalButton>
          </div>
        ) : (
          <LyricSectionModal
            key={lyricModalState.mode === 'edit' ? lyricModalState.sectionId : 'new'}
            onClose={() => setLyricModalState(null)}
            onSave={async (formData: LyricsSectionFormData) =>
              lyricModalState.mode === 'create'
                ? await handleSaveNewLyricsSection(formData as LyricsSectionFormData)
                : await handleSaveEditedSection(formData as LyricsSectionFormData)
            }
            sectionDetails={editingSection ?? {}}
            mode={lyricModalState.mode}
          />
        ))}
    </div>
  )
}

export default SongPage
