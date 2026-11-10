import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { useLiveQuery } from 'dexie-react-hooks'
import { toast } from 'react-toastify'

import Header from '#globals/components/header/header'
import { GlobalButton } from '#globals/components/global-button/global-button.tsx'
import { EditSongDetailsModal } from './components/edit-song-modal/edit-song-details-modal.tsx'
import { LyricSectionModal } from './components/lyric-section-modal/lyric-section-modal.tsx'
import { LyricContainer } from './components/lyric-container/lyric-container.tsx'

import { songsTable, songStatusesTable, songTagsTable } from '#lib/db.ts'
import { addSection } from '#lib/add-lyric-section.ts'
import { updateSection } from '#lib/edit-lyric-section.ts'

import type { SongStatus, SongTag, LyricsSection } from '#globals/types/global-types.tsx'

import styles from './song-page.module.css'

type SectionModalState = { mode: 'create' } | { mode: 'edit'; sectionId: string } | null

const SongPage = () => {
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [lyricModalState, setLyricModalState] = useState<SectionModalState>(null)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)

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
      await addSection(song?.id || '', formData)

      setLyricModalState(null)
    } catch (error) {
      console.error(error)
      toast.error('Failed to add new section')
    }
  }

  const handleMoveDown = async (id: string) => {
    const sectionIndex = song?.sections?.findIndex(section => section.id === id)

    if (sectionIndex === undefined || sectionIndex === -1 || sectionIndex === (song?.sections?.length ?? 0) - 1) return

    const newSections = [...(song?.sections ?? [])]
    const temp = newSections[sectionIndex]

    newSections[sectionIndex] = newSections[sectionIndex + 1]
    newSections[sectionIndex + 1] = temp

    try {
      await songsTable.update(song?.id || '', { sections: newSections })
    } catch (error) {
      toast.error('Failed to move section up or down')
      throw error
    }
  }

  const handleMoveUp = async (id: string) => {
    const sectionIndex = song?.sections?.findIndex(section => section.id === id)

    if (sectionIndex === undefined || sectionIndex <= 0) return

    const newSections = [...(song?.sections ?? [])]
    const temp = newSections[sectionIndex]

    newSections[sectionIndex] = newSections[sectionIndex - 1]
    newSections[sectionIndex - 1] = temp

    try {
      await songsTable.update(song?.id || '', { sections: newSections })
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

  const handleSaveEditedSection = async (formData: LyricsSection) => {
    try {
      const sections = [...(song?.sections ?? [])]
      const sectionIndex = sections.findIndex(section => section.id === formData.id)

      if (sectionIndex === undefined || sectionIndex === -1) return

      sections[sectionIndex] = formData

      await updateSection(song?.id || '', formData)
    } catch (error) {
      toast.error('Failed to update section')
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    const selectionIndex = song?.sections?.findIndex(section => section.id === id)

    if (selectionIndex === undefined || selectionIndex === -1) return

    const newSections = [...(song?.sections ?? [])]
    newSections.splice(selectionIndex, 1)

    try {
      await songsTable.update(song?.id || '', { sections: newSections })
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
                isSelected={section.id === selectedSectionId}
                onSelect={() => handleSelectSection(section.id)}
                onMoveDown={() => handleMoveDown(section.id)}
                onMoveUp={() => handleMoveUp(section.id)}
                onEdit={() => handleEdit(section.id)}
                onDelete={() => handleDelete(section.id)}
                onRecordingNotes={() => handleRecordingNotes(section.id)}
              />
            ))}

            <GlobalButton variant="secondary" onClick={() => setLyricModalState({ mode: 'create' })}>
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
          songId={song?.id || ''}
          details={details}
          tagsList={tags || []}
          statusList={statuses || []}
        />
      )}

      {lyricModalState && (
        <LyricSectionModal
          key={lyricModalState.mode === 'edit' ? lyricModalState.sectionId : 'new'}
          onClose={() => setLyricModalState(null)}
          onSave={async (formData: LyricsSection) =>
            lyricModalState.mode === 'create'
              ? await handleSaveNewLyricsSection(formData as LyricsSection)
              : await handleSaveEditedSection(formData as LyricsSection)
          }
          sectionDetails={editingSection ?? {}}
          mode={lyricModalState.mode}
        />
      )}
    </div>
  )
}

export default SongPage
