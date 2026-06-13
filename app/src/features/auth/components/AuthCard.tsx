import type { ReactNode } from 'react'
import { Text } from '#/components/ui/Text'
import { cx } from '#/lib/cx'

export type AuthCardProps = {
  eyebrow?: string
  headline: string
  lede?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export const AuthCard = ({
  eyebrow,
  headline,
  lede,
  children,
  footer,
  className,
}: AuthCardProps) => (
  <section className={cx('auth-card', className)}>
    {eyebrow ? (
      <Text as="span" variant="label-md" className="auth-card__eyebrow">
        {eyebrow}
      </Text>
    ) : null}
    <Text as="h1" variant="headline-lg" className="auth-card__headline">
      {headline}
    </Text>
    {lede ? (
      <Text as="p" variant="body-md" className="auth-card__lede">
        {lede}
      </Text>
    ) : null}
    <div className="auth-card__body">{children}</div>
    {footer ? <div className="auth-card__footer">{footer}</div> : null}
  </section>
)
