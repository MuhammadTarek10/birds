import { Badge } from '#/components/ui/Badge'
import type { PodRole } from '../types'

export const RoleBadge = ({ role }: { role: PodRole }) => (
  <Badge tone={role === 'admin' ? 'admin' : 'member'}>{role}</Badge>
)
