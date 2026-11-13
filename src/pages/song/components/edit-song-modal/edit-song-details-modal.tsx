import { useId, useState } from 'react'

import { IoClose } from 'react-icons/io5'

import { Modal } from '#globals/components/modal-portal/modal-portal'
import { GlobalButton } from '#globals/components/global-button/global-button.tsx'

import type { Song, SongStatusType } from '#globals/types/global-types'
import { songsTable } from '#lib/db.ts'

import styles from './edit-song-details-modal.module.css'

type Details = Pick<Song, 'title' | 'songKey' | 'bpm' | 'tuning' | 'tags' | 'status'>

interface EditSongDetailsModalProps {
  onClose: () => void
  songId: string
  details: Details
  tagsList: string[]
  statusList: SongStatusType[]
}

export const EditSongDetailsModal = ({ details, onClose, tagsList, statusList, songId }: EditSongDetailsModalProps) => {
  const [formData, setFormData] = useState<Details>(details)
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const titleId = useId()

  const handleAddTag = (tag: string) => {
    if (!tag) return

    setFormData(previous => ({
      ...previous,
      tags: previous.tags?.includes(tag) ? previous.tags : [...(previous.tags ?? []), tag]
    }))

    setSelectedTag('')
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(previous => ({
      ...previous,
      tags: (previous.tags ?? []).filter(item => item !== tag)
    }))
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSaving(true)
    setSaveError(null)

    try {
      const updatedCount = await songsTable.update(songId, { ...formData })

      if (updatedCount) {
        onClose()
      }
    } catch {
      setSaveError('Couldnt save song details. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal titleId={titleId} onClose={onClose}>
      <section className={styles.modalOuterContainer}>
        <div className={styles.modalInnerContainer}>
          <button type="button" aria-label="Close song details" onClick={onClose} className={styles.modalCloseButton}>
            <IoClose aria-hidden="true" />
          </button>

          <div className={styles.modalContentContainer}>
            <h3 id={titleId}>Edit Details</h3>

            <div className={styles.modalContent}>
              <div className={styles.modalContentItem}>
                <form onSubmit={handleSubmit} className={styles.modalContentForm}>
                  <div className={styles.modalContentItem}>
                    <label htmlFor="title">Title</label>
                    <input
                      autoFocus
                      data-initial-focus
                      type="text"
                      id="title"
                      placeholder="What is the title of the song..."
                      value={formData.title ?? ''}
                      onChange={event => setFormData({ ...formData, title: event.target.value ?? '' })}
                    />
                  </div>

                  <div className={styles.modalContentItem}>
                    <label htmlFor="songKey">Song Key</label>
                    <input
                      type="text"
                      id="songKey"
                      placeholder="What is the key of the song..."
                      value={formData.songKey ?? ''}
                      onChange={event => setFormData({ ...formData, songKey: event.target.value ?? '' })}
                    />
                  </div>

                  <div className={styles.modalContentItem}>
                    <label htmlFor="bpm">BPM</label>
                    <input
                      type="number"
                      id="bpm"
                      placeholder="What is the BPM of the song..."
                      value={formData.bpm ?? ''}
                      onChange={event =>
                        setFormData({ ...formData, bpm: event.target.value === '' ? null : Number(event.target.value) })
                      }
                    />
                  </div>

                  <div className={styles.modalContentItem}>
                    <label htmlFor="tuning">Tuning</label>
                    <input
                      type="text"
                      id="tuning"
                      placeholder="What is the tuning of the song..."
                      value={formData.tuning ?? ''}
                      onChange={event => setFormData({ ...formData, tuning: event.target.value ?? '' })}
                    />
                  </div>

                  <div className={styles.modalContentItem}>
                    <label htmlFor="tags">Tags</label>
                    <div>
                      <select id="tags" value={selectedTag} onChange={event => setSelectedTag(event.target.value)}>
                        <option value="">Choose a tag</option>

                        {tagsList.map(tag => (
                          <option key={tag} value={tag}>
                            {tag}
                          </option>
                        ))}
                      </select>

                      <GlobalButton
                        variant="primary"
                        type="button"
                        disabled={!selectedTag || (formData.tags ?? []).includes(selectedTag)}
                        onClick={() => handleAddTag(selectedTag)}
                      >
                        Add Tag
                      </GlobalButton>
                    </div>

                    <div className={styles.tagListContainer}>
                      {formData.tags?.map(tag => {
                        return (
                          <div key={tag} className={styles.selectedTagItem}>
                            <p>{tag}</p>

                            <button type="button" onClick={() => handleRemoveTag(tag)}>
                              X
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className={styles.modalContentItem}>
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      value={formData.status ?? ''}
                      onChange={event => setFormData({ ...formData, status: event.target.value as SongStatusType })}
                    >
                      {statusList.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {saveError && <p role="alert">{saveError}</p>}

                  <GlobalButton type="submit" variant="primary" disabled={isSaving} onClick={() => handleSubmit}>
                    {isSaving ? 'Saving...' : 'Update Song'}
                  </GlobalButton>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Modal>
  )
}
