import { queryOptions } from '@tanstack/react-query'
import { api } from '#/lib/api/client'

export type InvitePreview = {
  podName: string
  inviterEmail?: string
  email?: string | null
  expiresAt: string
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
