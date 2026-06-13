import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '#/lib/api/client'
import { ME_QUERY_KEY, meQuery } from '../api/queries'
import type { RegisterInput } from '../schemas/register.schema'

export const useRegister = (redirectTo: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (input: RegisterInput): Promise<void> => {
      await api.post('/auth/register', input)
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ME_QUERY_KEY })
      await queryClient.fetchQuery(meQuery)
      await navigate({ to: redirectTo })
    },
  })
}
