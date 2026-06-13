import type { LucideIcon } from 'lucide-react'
import { cx } from '#/lib/cx'

export type IconSize = 'sm' | 'md' | 'lg'
export type IconTone = 'primary' | 'gold' | 'muted' | 'danger' | 'current'

export type IconProps = {
  icon: LucideIcon
  size?: IconSize
  tone?: IconTone
  className?: string
  'aria-label'?: string
}

export const Icon = ({
  icon: Lucide,
  size = 'md',
  tone = 'current',
  className,
  'aria-label': ariaLabel,
}: IconProps) => (
  <Lucide
    aria-hidden={ariaLabel ? undefined : true}
    aria-label={ariaLabel}
    className={cx('icon', `icon--${size}`, `icon--${tone}`, className)}
  />
)
