import { queryOptions } from '@tanstack/react-query'
import { api } from '#/lib/api/client'

export type InvitePreview = {
  podName: string
  inviterEmail?: string
  email?: string | null
  expiresAt: string
}

export type Invite = {
  id: string
  token: string
  inviteUrl: string
  email: string | null
  expiresAt: string
  redeemedAt: string | null
  redeemedBy: string | null
  revokedAt: string | null
  createdAt: string
  createdBy: string
}

export const invitePreviewQuery = (token: string) =>
  queryOptions<InvitePreview>({
    queryKey: ['invite-preview', token],
    queryFn: async () => {
      const res = await api.get<InvitePreview>(`/invites/${token}`)
      return res.data
    },
    staleTime: 60_000,
    retry: false,
    enabled: token.length > 0,
  })

export const podInvitesKey = (podId: string) =>
  ['pods', podId, 'invites'] as const

export const podInvitesQuery = (podId: string) =>
  queryOptions<Array<Invite>>({
    queryKey: podInvitesKey(podId),
    queryFn: async () => {
      const res = await api.get<{ invites: Array<Invite> }>(
        `/pods/${podId}/invites`,
      )
      return res.data.invites
    },
    enabled: podId.length > 0,
  })
