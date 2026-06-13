import { queryOptions } from '@tanstack/react-query'
import { inviteKeys } from './keys'
import { invitesService } from './services/invites.service'
import type { Invite, InvitePreview } from './types'

export const invitePreviewQuery = (token: string) =>
  queryOptions<InvitePreview>({
    queryKey: inviteKeys.preview(token),
    queryFn: ({ signal }) => invitesService.preview(token, { signal }),
    staleTime: 60_000,
    retry: false,
    enabled: token.length > 0,
    meta: { silent: true },
  })

export const podInvitesQuery = (podId: string) =>
  queryOptions<Array<Invite>>({
    queryKey: inviteKeys.podInvites(podId),
    queryFn: ({ signal }) => invitesService.listForPod(podId, { signal }),
    enabled: podId.length > 0,
  })
