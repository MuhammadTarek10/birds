import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  PODS_KEY,
  podDetailQuery
  
} from '../api/queries'
import type {PodSummary} from '../api/queries';

export const useCurrentPod = (podId: string) => {
  const queryClient = useQueryClient()
  const cached = queryClient
    .getQueryData<Array<PodSummary>>(PODS_KEY)
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
