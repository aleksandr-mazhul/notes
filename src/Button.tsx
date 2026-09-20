import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger'
}

export default function Button({
  variant = 'primary',
  className,
  ...props
}: Props) {
  const classes = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(' ')

  return <button className={classes} {...props} />
}
