import { queryOptions } from '@tanstack/react-query'
import { api } from '#/lib/api/client'
import { ApiError } from '#/lib/api/error'

export type Me = {
  id: string
  email: string
  role: string
  status: string
  emailVerifiedAt: string | null
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
}

export const ME_QUERY_KEY = ['me'] as const

export const meQuery = queryOptions<Me | null>({
  queryKey: ME_QUERY_KEY,
  queryFn: async () => {
    try {
      const res = await api.get<Me>('/auth/me')
      return res.data
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return null
      throw err
    }
  },
  staleTime: 60_000,
  retry: false,
})
