import { useId, useState } from 'react'

import { Modal } from '#globals/components/modal-portal/modal-portal'
import { GlobalButton } from '#globals/components/global-button/global-button'

import styles from './update-recording-modal.module.css'

type UpdateRecordingFormInput = {
  name: string
  sectionId: string | null
}

type UpdateRecordingModalProps = {
  name: string
  sectionId: string | null
  handleSubmit: (updateRecordingFormInput: UpdateRecordingFormInput) => Promise<void>
  onClose: () => void
}

export const UpdateRecordingModal = ({ name, sectionId, handleSubmit, onClose }: UpdateRecordingModalProps) => {
  const [updateRecordingError, setUpdateRecordingError] = useState<string | null>(null)
  const [formData, setFormData] = useState<UpdateRecordingFormInput>({
    name: name || '',
    sectionId: sectionId
  })

  const titleId = useId()

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (typeof formData.name !== 'string') {
      console.log('error')
      setUpdateRecordingError('Please enter a name')
      return
    }

    const updatedRecordingDetails: UpdateRecordingFormInput = {
      name: formData.name.trim() || 'Untitled Recording',
      sectionId
    }

    try {
      await handleSubmit(updatedRecordingDetails)
    } catch (error) {
      console.error('error submitting form:', error)
      setUpdateRecordingError('Failed to save recording.')
    }
  }

  return (
    <Modal titleId={titleId} onClose={onClose}>
      <div>
        <h2>Edit Recording</h2>

        <form onSubmit={handleSubmitForm} className={styles.updateRecordingForm}>
          <input
            type="text"
            name="name"
            placeholder="Name your recording..."
            value={formData.name}
            onChange={event => setFormData({ ...formData, name: event.target.value })}
          />

          <GlobalButton type="submit" variant="primary" disabled={formData.name.length === 0}>
            Update Recording
          </GlobalButton>
        </form>
      </div>
    </Modal>
  )
}
