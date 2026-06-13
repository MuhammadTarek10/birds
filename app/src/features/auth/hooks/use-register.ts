import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authKeys } from '../keys'
import { meQuery } from '../queries'
import { authService } from '../services/auth.service'
import type { RegisterInput } from '../schemas/register.schema'

export const useRegister = (redirectTo: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: authKeys.me })
      await queryClient.fetchQuery(meQuery)
      await navigate({ to: redirectTo })
    },
    meta: { silent: true },
  })
}
