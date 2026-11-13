import { useId, useState } from 'react'

import { IoClose } from 'react-icons/io5'

import { Modal } from '#globals/components/modal-portal/modal-portal.tsx'
import { GlobalButton } from '#globals/components/global-button/global-button.tsx'

import type { LyricsSection } from '#globals/types/global-types.tsx'

import styles from './lyric-section-modal.module.css'

type LyricsSectionFormData = Pick<LyricsSection, 'title' | 'chords' | 'lyrics' | 'id'>

type LyricSectionModalMode = 'create' | 'edit'

interface LyricsSectionModalProps {
  onClose: () => void
  onSave: (formData: LyricsSectionFormData) => Promise<void>
  sectionDetails: Partial<LyricsSectionFormData>
  mode: LyricSectionModalMode
}

export const LyricSectionModal = ({ onClose, onSave, sectionDetails, mode }: LyricsSectionModalProps) => {
  const titleId = useId()

  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [selectedChord, setSelectedChord] = useState<string>('')
  const [formData, setFormData] = useState<LyricsSectionFormData>(() => ({
    id: sectionDetails.id ?? crypto.randomUUID(),
    title: sectionDetails.title ?? '',
    chords: sectionDetails.chords ?? [],
    lyrics: sectionDetails.lyrics ?? ''
  }))

  const handleAddChord = (chord: string) => {
    if (!chord) return

    setFormData(previous => ({
      ...previous,
      chords: [...(previous.chords ?? []), chord]
    }))

    setSelectedChord('')
  }

  const handleRemoveChord = (indexToRemove: number) => {
    setFormData(previous => ({
      ...previous,
      chords: (previous.chords ?? []).filter((_, index) => index !== indexToRemove)
    }))
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSaving(true)
    setSaveError(null)

    try {
      await onSave(formData)
      onClose()
    } catch {
      setSaveError('Couldnt save this sectionDetails. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal titleId={titleId} onClose={onClose}>
      <button
        type="button"
        className={styles.newLyricModalCloseButton}
        aria-label="Close section editor"
        onClick={onClose}
      >
        <IoClose />
      </button>

      <div className={styles.newLyricModalContentContainer}>
        <h3 id={titleId}>{mode === 'create' ? 'New Section' : 'Edit Section'}</h3>

        <form className={styles.newLyricModalForm} onSubmit={handleSubmit}>
          <div className={styles.newLyricModalFormItem}>
            <label htmlFor="title">Section Title</label>
            <input
              data-initial-focus
              autoFocus
              type="text"
              id="title"
              name="title"
              placeholder="Verse, Chorus, etc."
              value={formData.title ?? ''}
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
                  placeholder="Add a chord name and press Add Chord"
                  value={selectedChord}
                  onChange={event => setSelectedChord(event.target.value)}
                />

                <GlobalButton type="button" variant="primary" onClick={() => handleAddChord(selectedChord)}>
                  Add chord
                </GlobalButton>
              </div>

              <div className={styles.newLyricModalFormItemChordsContainer}>
                {formData.chords?.map((chord, indexToRemove) => (
                  <div key={chord} className={styles.newLyricModalFormItemChordTag}>
                    <p>{chord}</p>

                    <button
                      type="button"
                      aria-label={`Remove ${chord} chord at position ${indexToRemove + 1}`}
                      onClick={() => handleRemoveChord(indexToRemove)}
                    >
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
              placeholder="What are the lyrics of this section..."
              value={formData.lyrics ?? ''}
              onChange={event => setFormData({ ...formData, lyrics: event.target.value })}
            />
          </div>

          {saveError && <p role="alert">{saveError}</p>}

          <GlobalButton type="submit" variant="primary" onClick={() => handleSubmit} disabled={isSaving}>
            {isSaving ? 'Saving...' : mode === 'create' ? 'Add section' : 'Update section'}
          </GlobalButton>
        </form>
      </div>
    </Modal>
  )
}
