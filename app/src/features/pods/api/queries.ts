import { queryOptions } from '@tanstack/react-query'
import { api } from '#/lib/api/client'

export type PodRole = 'admin' | 'member'

export type PodSummary = {
  id: string
  name: string
  code: string
  role: PodRole
  joinedAt: string
  memberCount: number
}

export type PodMemberUser = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
}

export type PodMember = {
  id: string
  role: PodRole
  joinedAt: string
  user: PodMemberUser
}

export const PODS_KEY = ['pods'] as const
export const podKey = (id: string) => ['pods', id] as const
export const podMembersKey = (id: string) => ['pods', id, 'members'] as const

export const podsListQuery = queryOptions<Array<PodSummary>>({
  queryKey: PODS_KEY,
  queryFn: async () => {
    const res = await api.get<{ pods: Array<PodSummary> }>('/pods')
    return res.data.pods
  },
  staleTime: 60_000,
})

export const podDetailQuery = (id: string) =>
  queryOptions<PodSummary>({
    queryKey: podKey(id),
    queryFn: async () => {
      const res = await api.get<PodSummary>(`/pods/${id}`)
      return res.data
    },
    staleTime: 60_000,
    enabled: id.length > 0,
  })

export const podMembersListQuery = (id: string) =>
  queryOptions<Array<PodMember>>({
    queryKey: podMembersKey(id),
    queryFn: async () => {
      const res = await api.get<{ members: Array<PodMember> }>(
        `/pods/${id}/members`,
      )
      return res.data.members
    },
    enabled: id.length > 0,
  })
