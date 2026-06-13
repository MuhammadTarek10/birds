import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '#/lib/api/client'
import { toast } from '#/lib/toasts'
import { podInvitesKey  } from './queries'
import type {Invite} from './queries';

export type RedeemResult = {
  podId: string
  podName: string
}

export const useRedeemInvite = () =>
  useMutation({
    mutationFn: async (token: string): Promise<RedeemResult> => {
      const res = await api.post<RedeemResult>('/invites/redeem', { token })
      return res.data
    },
  })

export const useCreateInvite = (podId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      email?: string
      expiresInHours?: number
    }): Promise<Invite> => {
      const res = await api.post<Invite>(`/pods/${podId}/invites`, input)
      return res.data
    },
    onSuccess: async (invite) => {
      queryClient.setQueryData<Array<Invite>>(podInvitesKey(podId), (prev) =>
        prev ? [invite, ...prev] : [invite],
      )
      try {
        await navigator.clipboard.writeText(invite.inviteUrl)
        toast.success('Copied', 'Share the link like a love letter.')
      } catch {
        toast.success('Invite created', 'Copy the link from the table below.')
      }
    },
    onError: (err: Error) => toast.error("Couldn't create invite", err.message),
  })
}

export const useRevokeInvite = (podId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (inviteId: string) => {
      await api.delete(`/pods/${podId}/invites/${inviteId}`)
      return inviteId
    },
    onSuccess: (inviteId) => {
      queryClient.setQueryData<Array<Invite>>(podInvitesKey(podId), (prev) =>
        prev?.map((i) =>
          i.id === inviteId ? { ...i, revokedAt: new Date().toISOString() } : i,
        ),
      )
      toast.success('Invite revoked')
    },
    onError: (err: Error) => toast.error("Couldn't revoke invite", err.message),
  })
}
