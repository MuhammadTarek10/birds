import { Link } from '@tanstack/react-router'
import { Text } from '#/components/ui/Text'
import type { PodMember, PodSummary } from '../types'
import { initials } from '../utils/name'

export type PodCoverProps = {
  pod: PodSummary
  members: Array<PodMember>
}

export const PodCover = ({ pod, members }: PodCoverProps) => {
  const visible = members.slice(0, 5)
  const more = Math.max(0, members.length - visible.length)

  return (
    <section className="pod-cover">
      <Text as="span" variant="label-md" className="pod-cover__eyebrow">
        Code · {pod.code}
      </Text>
      <Text as="h1" variant="display-lg" className="pod-cover__name">
        {pod.name}
      </Text>
      <Text variant="body-lg" className="pod-cover__lede">
        {pod.memberCount} {pod.memberCount === 1 ? 'keeper' : 'keepers'}. Memories will live here once they begin.
      </Text>
      <div className="pod-cover__divider" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <Link
        to="/pods/$podId/members"
        params={{ podId: pod.id }}
        className="pod-cover__avatars"
        aria-label={`See all ${pod.memberCount} members`}
      >
        {visible.map((m) => (
          <span key={m.id} className="stacked-avatar" title={m.user.email}>
            {initials(m.user)}
          </span>
        ))}
        {more > 0 ? (
          <span className="stacked-avatar stacked-avatar--more">+{more}</span>
        ) : null}
      </Link>
      <div className="pod-cover__memories" aria-hidden="true">
        Memories will live here.
      </div>
    </section>
  )
}
