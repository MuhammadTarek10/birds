import { Link } from '@tanstack/react-router'
import { Text } from '#/components/ui/Text'
import type { PodSummary } from '../types'
import { RoleBadge } from './RoleBadge'

export const PodCard = ({ pod }: { pod: PodSummary }) => (
  <Link
    to="/pods/$podId"
    params={{ podId: pod.id }}
    className="pod-card"
  >
    <span aria-hidden="true" className="pod-card__ornament">
      ❦
    </span>
    <div className="pod-card__name">{pod.name}</div>
    <div className="pod-card__meta">
      <RoleBadge role={pod.role} />
      <Text as="span" variant="label-md" className="pod-card__code">
        {pod.memberCount} {pod.memberCount === 1 ? 'keeper' : 'keepers'}
      </Text>
    </div>
  </Link>
)

export type PodCardGhostProps = {
  onClick: () => void
}

export const PodCardGhost = ({ onClick }: PodCardGhostProps) => (
  <button type="button" onClick={onClick} className="pod-card pod-card--ghost">
    <span aria-hidden="true" className="pod-card__ornament">
      ✚
    </span>
    <div className="pod-card__name">New pod</div>
    <Text as="span" variant="label-md" className="pod-card__code">
      Begin a new room
    </Text>
  </button>
)
