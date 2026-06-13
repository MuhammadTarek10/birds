import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Text } from '#/components/ui/Text'
import { useMe } from '#/features/auth/hooks/use-me'
import {
  podDetailQuery,
  podMembersListQuery,
} from '#/features/pods/api/queries'
import { MemberTable } from '#/features/pods/components/MemberTable'

export const Route = createFileRoute('/_app/pods/$podId/members')({
  component: MembersPage,
})

function MembersPage() {
  const { podId } = Route.useParams()
  const pod = useQuery(podDetailQuery(podId))
  const members = useQuery(podMembersListQuery(podId))
  const me = useMe()

  return (
    <main className="pod-page">
      <header className="pod-page__header">
        <Text as="span" variant="label-md" className="pod-page__eyebrow">
          Members
        </Text>
        <Text as="h1" variant="headline-lg" className="pod-page__title">
          Who&rsquo;s in {pod.data?.name ?? 'this pod'}
        </Text>
      </header>
      {members.data && me.data ? (
        <MemberTable
          podId={podId}
          members={members.data}
          viewerUserId={me.data.id}
          viewerIsAdmin={pod.data?.role === 'admin'}
        />
      ) : null}
    </main>
  )
}
