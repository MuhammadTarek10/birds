import { useQuery, useQueryClient } from '@tanstack/react-query'
import { podKeys } from '../keys'
import { podDetailQuery } from '../queries'
import type { PodSummary } from '../types'

export const useCurrentPod = (podId: string) => {
  const queryClient = useQueryClient()
  const cached = queryClient
    .getQueryData<Array<PodSummary>>(podKeys.all)
    ?.find((p) => p.id === podId)

  const detail = useQuery({
    ...podDetailQuery(podId),
    initialData: cached,
  })

  return {
    pod: detail.data,
    isAdmin: detail.data?.role === 'admin',
    isLoading: detail.isLoading,
  }
}
