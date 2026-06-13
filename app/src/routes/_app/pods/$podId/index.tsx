import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  podDetailQuery,
  podMembersListQuery,
} from '#/features/pods/queries'
import { PodCover } from '#/features/pods/components/PodCover'

export const Route = createFileRoute('/_app/pods/$podId/')({
  component: PodOverview,
})

function PodOverview() {
  const { podId } = Route.useParams()
  const pod = useQuery(podDetailQuery(podId))
  const members = useQuery(podMembersListQuery(podId))

  if (!pod.data) return null

  return (
    <main className="pod-page">
      <PodCover pod={pod.data} members={members.data ?? []} />
    </main>
  )
}
