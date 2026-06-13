import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '#/lib/cx'

export type BadgeTone =
  | 'admin'
  | 'member'
  | 'pending'
  | 'redeemed'
  | 'revoked'
  | 'expired'

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'style'> & {
  tone: BadgeTone
  children: ReactNode
}

export const Badge = ({ tone, className, children, ...rest }: BadgeProps) => (
  <span className={cx('badge', `badge--${tone}`, className)} {...rest}>
    {children}
  </span>
)
