import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '#/lib/api/client'
import { ME_QUERY_KEY, meQuery } from '../api/queries'
import type { LoginInput } from '../schemas/login.schema'

export const useLogin = (redirectTo: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (input: LoginInput): Promise<void> => {
      await api.post('/auth/login', input)
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ME_QUERY_KEY })
      await queryClient.fetchQuery(meQuery)
      await navigate({ to: redirectTo })
    },
  })
}
