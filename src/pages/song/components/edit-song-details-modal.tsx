import { useState } from 'react'

import { IoClose } from 'react-icons/io5'
import { Modal } from '../../../globals/components/modal-portal/modal-portal'

import type { Song } from '../../../globals/types/global-types'

import styles from './edit-song-details-modal.module.css'

type Details = Pick<Song, 'title' | 'songKey' | 'bpm' | 'tuning' | 'tags' | 'status'>

interface EditSongDetailsModalProps {
  onClose: () => void
  details: Details
  tagsList: string[]
  onSave: (details: Details) => void
}

export const EditSongDetailsModal = ({ details, onClose, onSave, tagsList }: EditSongDetailsModalProps) => {
  const [formData, setFormData] = useState<Details>(details)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave(formData)
  }

  return (
    <Modal>
      <section className={styles.modalOuterContainer}>
        <div className={styles.modalInnerContainer}>
          <button type="button" onClick={onClose} className={styles.modalCloseButton}>
            <IoClose />
          </button>

          <div className=".modal-content-container">
            <h1>Edit Details</h1>
            <div className={styles.modalContent}>
              <div className={styles.modalContentItem}>
                <form onSubmit={handleSubmit}>
                  <div className={styles.modalContentItem}>
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      value={details.title}
                      onChange={event => onSave({ ...details, title: event.target.value })}
                    />
                  </div>

                  <div className={styles.modalContentItem}>
                    <label htmlFor="songKey">Song Key</label>
                    <input
                      type="text"
                      id="songKey"
                      value={formData.songKey ?? ''}
                      onChange={event => setFormData({ ...formData, songKey: event.target.value })}
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
                      onChange={event => setFormData({ ...formData, tuning: event.target.value })}
                    />
                  </div>

                  <div className={styles.modalContentItem}>
                    <label htmlFor="tags">Tags</label>
                    <select
                      id="tags"
                      value={formData.tags?.join(', ') ?? ''}
                      onChange={event => setFormData({ ...formData, tags: event.target.value.split(', ') })}
                    >
                      {tagsList.map(tag => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.modalContentItem}>
                    <label htmlFor="status">Status</label>
                    <input
                      type="text"
                      id="status"
                      value={details.status}
                      onChange={event => onSave({ ...details, status: event.target.value })}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Modal>
  )
}
