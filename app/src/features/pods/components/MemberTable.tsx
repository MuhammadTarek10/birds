import { cx } from '#/lib/cx'
import type { PodMember } from '../types'
import { displayName, hasName, initials } from '../utils/name'
import { MemberRowActions } from './MemberRowActions'
import { RoleBadge } from './RoleBadge'

const formatJoined = (iso: string): string => {
  const date = new Date(iso)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export type MemberTableProps = {
  podId: string
  members: Array<PodMember>
  viewerUserId: string
  viewerIsAdmin: boolean
}

export const MemberTable = ({
  podId,
  members,
  viewerUserId,
  viewerIsAdmin,
}: MemberTableProps) => (
  <ul className="member-table" aria-label="Pod members">
    {members.map((m) => {
      const named = hasName(m.user)
      return (
        <li key={m.id} className="member-row">
          <span aria-hidden="true" className="member-row__avatar">
            {initials(m.user)}
          </span>
          <div className="member-row__identity">
            <span
              className={cx(
                'member-row__name',
                !named && 'member-row__name--email',
              )}
            >
              {displayName(m.user)}
            </span>
            {named ? (
              <span className="member-row__email">{m.user.email}</span>
            ) : null}
          </div>
          <span className="member-row__role">
            <RoleBadge role={m.role} />
          </span>
          <span className="member-row__joined">{formatJoined(m.joinedAt)}</span>
          <MemberRowActions
            podId={podId}
            member={m}
            viewerUserId={viewerUserId}
            viewerIsAdmin={viewerIsAdmin}
          />
        </li>
      )
    })}
  </ul>
)
