import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authKeys } from '../keys'
import { authService } from '../services/auth.service'

export const useLogout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: async () => {
      queryClient.setQueryData(authKeys.me, null)
      await navigate({ to: '/login' })
    },
    meta: { silent: true },
  })
}
