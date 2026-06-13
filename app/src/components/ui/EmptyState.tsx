import type { ReactNode } from 'react'
import { Text } from './Text'

export type EmptyStateProps = {
  eyebrow?: string
  title: string
  body: string
  action?: ReactNode
}

export const EmptyState = ({
  eyebrow,
  title,
  body,
  action,
}: EmptyStateProps) => (
  <section className="empty-state">
    <span aria-hidden="true" className="empty-state__ornament">❦</span>
    {eyebrow ? (
      <Text as="span" variant="label-md" className="empty-state__eyebrow">
        {eyebrow}
      </Text>
    ) : null}
    <Text as="h2" variant="headline-lg-mobile" className="empty-state__title">
      {title}
    </Text>
    <Text variant="body-md" className="empty-state__body">
      {body}
    </Text>
    {action ? <div className="empty-state__action">{action}</div> : null}
  </section>
)
