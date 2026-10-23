import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger'
}

const baseClass =
  'cursor-pointer rounded-md border border-transparent px-4 py-2.5 text-sm leading-none font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40'

const variantClass = {
  primary: 'bg-ink text-white enabled:hover:bg-ink-hover enabled:active:bg-black',
  danger:
    'border-line-strong bg-transparent text-ink enabled:hover:border-danger enabled:hover:text-danger enabled:active:bg-danger-soft',
}

export default function Button({
  variant = 'primary',
  className,
  ...props
}: Props) {
  const classes = [baseClass, variantClass[variant], className]
    .filter(Boolean)
    .join(' ')

  return <button className={classes} {...props} />
}
