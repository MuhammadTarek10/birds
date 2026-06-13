import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '#/lib/toasts'
import { inviteKeys } from './keys'
import { invitesService } from './services/invites.service'
import type { Invite } from './types'

export const useRedeemInvite = () =>
  useMutation({
    mutationFn: (token: string) => invitesService.redeem(token),
    meta: { silent: true },
  })

export const useCreateInvite = (podId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { email?: string; expiresInHours?: number }) =>
      invitesService.create(podId, input),
    onSuccess: async (invite) => {
      queryClient.setQueryData<Array<Invite>>(
        inviteKeys.podInvites(podId),
        (prev) => (prev ? [invite, ...prev] : [invite]),
      )
      try {
        await navigator.clipboard.writeText(invite.inviteUrl)
        toast.success('Copied', 'Share the link like a love letter.')
      } catch {
        toast.success('Invite created', 'Copy the link from the table below.')
      }
    },
  })
}

export const useRevokeInvite = (podId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inviteId: string) =>
      invitesService.revoke(podId, inviteId).then(() => inviteId),
    onSuccess: (inviteId) => {
      queryClient.setQueryData<Array<Invite>>(
        inviteKeys.podInvites(podId),
        (prev) =>
          prev?.map((i) =>
            i.id === inviteId ? { ...i, revokedAt: new Date().toISOString() } : i,
          ),
      )
    },
    meta: { successMessage: 'Invite revoked' },
  })
}
