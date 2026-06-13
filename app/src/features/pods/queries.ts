import { queryOptions } from '@tanstack/react-query'
import { podKeys } from './keys'
import { podsService } from './services/pods.service'
import type { PodMember, PodSummary } from './types'

export const podsListQuery = queryOptions<Array<PodSummary>>({
  queryKey: podKeys.all,
  queryFn: ({ signal }) => podsService.list({ signal }),
  staleTime: 60_000,
})

export const podDetailQuery = (id: string) =>
  queryOptions<PodSummary>({
    queryKey: podKeys.detail(id),
    queryFn: ({ signal }) => podsService.detail(id, { signal }),
    staleTime: 60_000,
    enabled: id.length > 0,
    meta: { silent: true },
  })

export const podMembersListQuery = (id: string) =>
  queryOptions<Array<PodMember>>({
    queryKey: podKeys.members(id),
    queryFn: ({ signal }) => podsService.members(id, { signal }),
    enabled: id.length > 0,
  })
