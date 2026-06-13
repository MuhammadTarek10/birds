import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { ApiError } from '#/lib/api/error'
import { toast } from '#/lib/toasts'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      silent?: boolean
      successMessage?: string
    }
    queryMeta: {
      silent?: boolean
    }
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.silent) return
      const message = error instanceof ApiError ? error.message : 'An unexpected error occurred'
      toast.error('Something went wrong', message)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _vars, _ctx, mutation) => {
      if (mutation.meta?.silent) return
      const message = error instanceof ApiError ? error.message : 'An unexpected error occurred'
      toast.error('Something went wrong', message)
    },
    onSuccess: (_data, _vars, _ctx, mutation) => {
      if (mutation.meta?.successMessage) {
        toast.success(mutation.meta.successMessage)
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
