import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'
import { ApiError } from '#/lib/api/error'
import {
  podDetailQuery,
  podMembersListQuery,
  podsListQuery,
} from '#/features/pods/api/queries'
import { PodTabs } from '#/features/pods/components/PodTabs'
import { writeLastPodId } from '#/features/pods/hooks/use-last-pod-id'

export const Route = createFileRoute('/_app/pods/$podId')({
  beforeLoad: async ({ context, params }) => {
    try {
      await context.queryClient.ensureQueryData(podDetailQuery(params.podId))
    } catch (err) {
      if (err instanceof ApiError && (err.status === 403 || err.status === 404)) {
        throw redirect({ to: '/pods' })
      }
      throw err
    }
  },
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(podsListQuery),
      context.queryClient.ensureQueryData(podMembersListQuery(params.podId)),
    ])
  },
  component: PodLayout,
})

function PodLayout() {
  const { podId } = Route.useParams()
  useEffect(() => {
    writeLastPodId(podId)
  }, [podId])

  return (
    <>
      <PodTabs podId={podId} />
      <Outlet />
    </>
  )
}
