import styles from './header.module.css'

interface HeaderProps {
  title: string
  description?: string
  buttons?: ButtonProps[]
}

interface ButtonProps {
  title: string
  type: 'primary' | 'secondary'
  onClick?: () => void
}

const Header = ({ title, description, buttons }: HeaderProps) => {
  return (
    <section className={styles.header_container}>
      <div>
        <h2>{title}</h2>
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
