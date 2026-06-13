import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authKeys } from '../keys'
import { meQuery } from '../queries'
import { authService } from '../services/auth.service'
import type { LoginInput } from '../schemas/login.schema'

export const useLogin = (redirectTo: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: authKeys.me })
      await queryClient.fetchQuery(meQuery)
      await navigate({ to: redirectTo })
    },
    meta: { silent: true },
  })
}
