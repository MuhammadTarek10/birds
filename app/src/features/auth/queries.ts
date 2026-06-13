import { queryOptions } from '@tanstack/react-query'
import { ApiError } from '#/lib/api/error'
import { authService } from './services/auth.service'
import { authKeys } from './keys'
import type { Me } from './types'

export const meQuery = queryOptions<Me | null>({
  queryKey: authKeys.me,
  queryFn: async ({ signal }) => {
    try {
      return await authService.me({ signal })
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return null
      throw err
    }
  },
  staleTime: 60_000,
  retry: false,
  meta: { silent: true },
})
