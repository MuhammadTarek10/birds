import type { LabelHTMLAttributes, ReactNode } from 'react'
import { cx } from '#/lib/cx'

export type LabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, 'style'> & {
  children: ReactNode
}

export const Label = ({ className, children, ...rest }: LabelProps) => (
  <label className={cx('label', className)} {...rest}>
    {children}
  </label>
)
