import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '#/lib/cx'

export type CardVariant = 'plain' | 'vault'

export type CardProps = Omit<HTMLAttributes<HTMLDivElement>, 'style'> & {
  variant?: CardVariant
  children?: ReactNode
}

export const Card = ({
  variant = 'plain',
  className,
  children,
  ...rest
}: CardProps) => (
  <div
    className={cx('card', variant === 'vault' && 'card--vault', className)}
    {...rest}
  >
    {children}
  </div>
)
