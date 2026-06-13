import { useMutation } from '@tanstack/react-query'
import { api } from '#/lib/api/client'

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
