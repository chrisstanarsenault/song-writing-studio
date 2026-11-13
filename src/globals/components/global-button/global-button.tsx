import styles from './global-button.module.css'

type Variant = 'primary' | 'secondary'

interface GlobalButtonProps {
  children: React.ReactNode
  variant: Variant
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  textAlign?: 'left' | 'center' | 'right'
  onClick?: () => void
}

export const GlobalButton = ({
  children,
  variant,
  disabled,
  fullWidth,
  type = 'button',
  textAlign = 'center',
  onClick
}: GlobalButtonProps) => {
  return (
    <button
      className={`${styles.globalButton} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''} ${styles[textAlign]}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}
