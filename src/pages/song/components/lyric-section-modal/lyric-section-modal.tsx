import { useState } from 'react'

import { IoClose } from 'react-icons/io5'
import { Modal } from '../../../../globals/components/modal-portal/modal-portal.tsx'

import type { LyricsSection } from '../../../../globals/types/global-types.tsx'

import styles from './lyric-section-modal.module.css'

type LyricsSectionFormData = Pick<LyricsSection, 'title' | 'chords' | 'lyrics' | 'id' | 'createdAt' | 'updatedAt'>

type LyricSectionModalMode = 'create' | 'edit'

interface LyricsSectionModalProps {
  onClose: () => void
  onSave: (formData: LyricsSectionFormData) => Promise<void>
  sectionDetails: Partial<LyricsSectionFormData>
  mode: LyricSectionModalMode
}

export const LyricSectionModal = ({ onClose, onSave, sectionDetails, mode }: LyricsSectionModalProps) => {
  const [formData, setFormData] = useState<LyricsSectionFormData>(() => ({
    id: sectionDetails.id ?? crypto.randomUUID(),
    title: sectionDetails.title ?? '',
    chords: sectionDetails.chords ?? [],
    lyrics: sectionDetails.lyrics ?? '',
    createdAt: sectionDetails.createdAt ?? new Date().toISOString(),
    updatedAt: sectionDetails.updatedAt ?? new Date().toISOString()
  }))
  const [selectedChord, setSelectedChord] = useState<string>('')

  const handleAddChord = (chord: string) => {
    if (!chord) return

    setFormData(previous => ({
      ...previous,
      chords: previous.chords?.includes(chord) ? previous.chords : [...(previous.chords ?? []), chord]
    }))

    setSelectedChord('')
  }

  const handleRemoveChord = (chord: string) => {
    setFormData(previous => ({
      ...previous,
      chords: (previous.chords ?? []).filter(item => item !== chord)
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return (
    <Modal>
      <section className={styles.newLyricModalOuterContainer}>
        <div className={styles.newLyricModalInnerContainer}>
          <button type="button" className={styles.newLyricModalCloseButton} onClick={onClose}>
            <IoClose />
          </button>

          <div className={styles.newLyricModalContentContainer}>
            <h3>{mode === 'create' ? 'New Section' : 'Edit Section'}</h3>

            <form className={styles.newLyricModalForm} onSubmit={handleSubmit}>
              <div className={styles.newLyricModalFormItem}>
                <label htmlFor="title">Section Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={event => setFormData({ ...formData, title: event.target.value })}
                />
              </div>

              <div className={styles.newLyricModalFormItem}>
                <label htmlFor="chords">Section chords</label>

                <div className={styles.newLyricModalFormItemChordsContainer}>
                  <div className={styles.newLyricModalFormItemChordsInput}>
                    <input
                      type="text"
                      id="chords"
                      name="chords"
                      value={selectedChord}
                      onChange={event => setSelectedChord(event.target.value)}
                    />
                    <button type="button" onClick={() => handleAddChord(selectedChord)}>
                      Add chord
                    </button>
                  </div>

                  <div className={styles.newLyricModalFormItemChordsContainer}>
                    {formData.chords?.map(chord => (
                      <div key={chord} className={styles.newLyricModalFormItemChordTag}>
                        <p>{chord}</p>

                        <button type="button" onClick={() => handleRemoveChord(chord)}>
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.newLyricModalFormItem}>
                <label htmlFor="lyrics">Section lyrics</label>
                <textarea
                  id="lyrics"
                  name="lyrics"
                  value={formData.lyrics}
                  onChange={event => setFormData({ ...formData, lyrics: event.target.value })}
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                {mode === 'create' ? 'Add section' : 'Update section'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </Modal>
  )
}
