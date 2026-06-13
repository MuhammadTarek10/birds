import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '#/lib/api/client'
import { ME_QUERY_KEY } from '../api/queries'

export const useLogout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.post('/auth/logout')
    },
    onSettled: async () => {
      queryClient.setQueryData(ME_QUERY_KEY, null)
      await navigate({ to: '/login' })
    },
  })
}
