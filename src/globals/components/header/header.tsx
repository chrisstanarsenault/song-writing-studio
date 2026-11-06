import { MdEdit } from 'react-icons/md'

import styles from './header.module.css'

interface HeaderProps {
  title: string
  description?: string
  buttons?: ButtonProps[]
  editIcon?: boolean
  editIconOnClick?: () => void
}

interface ButtonProps {
  title: string
  type: 'primary' | 'secondary'
  onClick?: () => void
}

const Header = ({ title, description, buttons, editIcon = false, editIconOnClick }: HeaderProps) => {
  return (
    <section className={styles.header_container}>
      <div>
        <div>
          <h2>{title}</h2>
          {editIcon && (
            <button type="button" className={styles.edit_icon} onClick={editIconOnClick}>
              <MdEdit />
            </button>
          )}
        </div>

        {description && <h3>{description}</h3>}
      </div>

      {buttons && buttons.length > 0 && (
        <div className={styles.buttons_container}>
          {buttons.map((button: ButtonProps) => (
            <button key={button.title} onClick={button.onClick}>
              {button.title}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default Header
