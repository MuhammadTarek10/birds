import { http } from '#/lib/api/http'
import { endpoints } from '#/lib/api/endpoints'
import type { Invite, InvitePreview, RedeemResult } from '../types'

type Opts = { signal?: AbortSignal }
type CreateInviteInput = { email?: string; expiresInHours?: number }

export const invitesService = {
  preview: (token: string, opts: Opts = {}): Promise<InvitePreview> =>
    http.get<InvitePreview>(endpoints.invites.preview(token), opts),
  redeem: (token: string): Promise<RedeemResult> =>
    http.post<RedeemResult>(endpoints.invites.redeem, { token }),
  listForPod: (podId: string, opts: Opts = {}): Promise<Array<Invite>> =>
    http
      .get<{ invites: Array<Invite> }>(endpoints.pods.invites(podId), opts)
      .then((d) => d.invites),
  create: (podId: string, input: CreateInviteInput): Promise<Invite> =>
    http.post<Invite>(endpoints.pods.invites(podId), input),
  revoke: (podId: string, inviteId: string): Promise<void> =>
    http.delete<void>(endpoints.pods.invite(podId, inviteId)),
}
