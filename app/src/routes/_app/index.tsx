import { createFileRoute, redirect } from '@tanstack/react-router'
import { podsListQuery } from '#/features/pods/queries'
import { readLastPodId } from '#/features/pods/hooks/use-last-pod-id'

export const Route = createFileRoute('/_app/')({
  beforeLoad: async ({ context }) => {
    const pods = await context.queryClient
      .ensureQueryData(podsListQuery)
      .catch(() => [])
    const last = readLastPodId()
    const target =
      (last ? pods.find((p) => p.id === last) : undefined) ??
      (pods.length > 0 ? pods[0] : undefined)
    if (target) {
      throw redirect({ to: '/pods/$podId', params: { podId: target.id } })
    }
    throw redirect({ to: '/pods' })
  },
})
