import { Badge } from '#/components/ui/Badge'
import type { BadgeTone } from '#/components/ui/Badge'
import { Button } from '#/components/ui/Button'
import { Text } from '#/components/ui/Text'
import { useRevokeInvite } from '../api/mutations'
import type { Invite } from '../api/queries'
import { CopyButton } from './CopyButton'

type Status = {
  tone: BadgeTone
  label: string
  isPending: boolean
}

const statusOf = (invite: Invite): Status => {
  if (invite.revokedAt) return { tone: 'revoked', label: 'Revoked', isPending: false }
  if (invite.redeemedAt) return { tone: 'redeemed', label: 'Redeemed', isPending: false }
  if (new Date(invite.expiresAt).getTime() < Date.now())
    return { tone: 'expired', label: 'Expired', isPending: false }
  return { tone: 'pending', label: 'Pending', isPending: true }
}

const maskUrl = (url: string): string => {
  try {
    const u = new URL(url)
    const token = u.pathname.split('/').filter(Boolean).pop() ?? ''
    const masked = token.length > 8 ? `${token.slice(0, 6)}…` : token
    return `${u.host}${u.pathname.replace(token, masked)}`
  } catch {
    return url
  }
}

const formatExpires = (iso: string): string => {
  const ms = new Date(iso).getTime() - Date.now()
  if (ms < 0) return 'Past'
  const hours = Math.round(ms / (1000 * 60 * 60))
  if (hours < 24) return `In ${hours}h`
  const days = Math.round(hours / 24)
  return `In ${days}d`
}

export const InviteTable = ({
  podId,
  invites,
}: {
  podId: string
  invites: Array<Invite>
}) => {
  const revoke = useRevokeInvite(podId)

  return (
    <ul className="invite-table" aria-label="Invites">
      {invites.map((invite) => {
        const status = statusOf(invite)
        return (
          <li key={invite.id} className="invite-row">
            <span className="invite-row__status">
              <Badge tone={status.tone}>{status.label}</Badge>
            </span>
            <span className="invite-row__url" title={invite.inviteUrl}>
              <span className="invite-row__url-text">
                {maskUrl(invite.inviteUrl)}
              </span>
              {status.isPending ? <CopyButton value={invite.inviteUrl} /> : null}
            </span>
            <Text
              as="span"
              variant="body-md"
              className={
                invite.email
                  ? 'invite-row__email'
                  : 'invite-row__email invite-row__email--anyone'
              }
            >
              {invite.email ?? 'Anyone with the link'}
            </Text>
            <span className="invite-row__expires">
              {formatExpires(invite.expiresAt)}
            </span>
            {status.isPending ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={revoke.isPending}
                onClick={() => revoke.mutate(invite.id)}
              >
                Revoke
              </Button>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
