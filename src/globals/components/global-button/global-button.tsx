import styles from './global-button.module.css'

type Variant = 'primary' | 'secondary'

interface GlobalButtonProps {
  children: React.ReactNode
  variant: Variant
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick: () => void
}

export const GlobalButton = ({
  children,
  variant,
  disabled,
  fullWidth,
  type = 'button',
  onClick
}: GlobalButtonProps) => {
  return (
    <button
      className={`${styles.globalButton} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}
