import { useState } from 'react'

import { IoClose } from 'react-icons/io5'

import { Modal } from '#globals/components/modal-portal/modal-portal'
import { GlobalButton } from '#globals/components/global-button/global-button.tsx'

import type { Song } from '#globals/types/global-types'
import { songsTable } from '#lib/db.ts'

import styles from './edit-song-details-modal.module.css'

type Details = Pick<Song, 'title' | 'songKey' | 'bpm' | 'tuning' | 'tags' | 'status'>

interface EditSongDetailsModalProps {
  onClose: () => void
  songId: string
  details: Details
  tagsList: string[]
  statusList: string[]
}

export const EditSongDetailsModal = ({ details, onClose, tagsList, statusList, songId }: EditSongDetailsModalProps) => {
  const [formData, setFormData] = useState<Details>(details)
  const [selectedTag, setSelectedTag] = useState<string>('')

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const updatedCount = await songsTable.update(songId, { ...formData })

      if (updatedCount) {
        onClose()
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return (
    <Modal>
      <section className={styles.modalOuterContainer}>
        <div className={styles.modalInnerContainer}>
          <button type="button" onClick={onClose} className={styles.modalCloseButton}>
            <IoClose />
          </button>

          <div className={styles.modalContentContainer}>
            <h3>Edit Details</h3>
            <div className={styles.modalContent}>
              <div className={styles.modalContentItem}>
                <form onSubmit={handleSubmit} className={styles.modalContentForm}>
                  <div className={styles.modalContentItem}>
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title ?? ''}
                      onChange={event => setFormData({ ...formData, title: event.target.value ?? '' })}
                    />
                  </div>

                  <div className={styles.modalContentItem}>
                    <label htmlFor="songKey">Song Key</label>
                    <input
                      type="text"
                      id="songKey"
                      value={formData.songKey ?? ''}
                      onChange={event => setFormData({ ...formData, songKey: event.target.value ?? '' })}
                    />
                  </div>

                  <div className={styles.modalContentItem}>
                    <label htmlFor="bpm">BPM</label>
                    <input
                      type="number"
                      id="bpm"
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

                      <button
                        type="button"
                        disabled={!selectedTag || (formData.tags ?? []).includes(selectedTag)}
                        onClick={() => handleAddTag(selectedTag)}
                      >
                        Add Tag
                      </button>
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
                      onChange={event => setFormData({ ...formData, status: event.target.value })}
                    >
                      {statusList.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <GlobalButton type="submit" variant="primary" onClick={() => handleSubmit}>
                    Update Song
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
