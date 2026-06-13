import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cx } from '#/lib/cx'
import { Icon } from './Icon'

export type ButtonVariant = 'primary' | 'ghost' | 'gold'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'style'
> & {
  variant?: ButtonVariant
  size?: ButtonSize
  leading?: LucideIcon
  trailing?: LucideIcon
  children?: ReactNode
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  leading,
  trailing,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    className={cx('btn', `btn--${variant}`, `btn--${size}`, className)}
    {...rest}
  >
    {leading ? <Icon icon={leading} size={size} tone="current" /> : null}
    {children}
    {trailing ? <Icon icon={trailing} size={size} tone="current" /> : null}
  </button>
)
