import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '#/components/ui/EmptyState'
import { Text } from '#/components/ui/Text'
import { podInvitesQuery } from '#/features/invites/queries'
import { CreateInviteForm } from '#/features/invites/components/CreateInviteForm'
import { InviteTable } from '#/features/invites/components/InviteTable'
import { podDetailQuery } from '#/features/pods/queries'

export const Route = createFileRoute('/_app/pods/$podId/invites')({
  component: InvitesPage,
})

function InvitesPage() {
  const { podId } = Route.useParams()
  const pod = useQuery(podDetailQuery(podId))
  const isAdmin = pod.data?.role === 'admin'

  const invites = useQuery({
    ...podInvitesQuery(podId),
    enabled: isAdmin,
  })

  if (!pod.data) return null

  if (!isAdmin) {
    return (
      <main className="pod-page">
        <EmptyState
          eyebrow="Admin only"
          title="Invitations are an admin matter"
          body="Ask an admin to send you a sharable link for someone you'd like to invite in."
        />
      </main>
    )
  }

  return (
    <main className="pod-page">
      <header className="pod-page__header">
        <Text as="span" variant="label-md" className="pod-page__eyebrow">
          Invites
        </Text>
        <Text as="h1" variant="headline-lg" className="pod-page__title">
          Send someone a key
        </Text>
      </header>
      <CreateInviteForm podId={podId} />
      {invites.data && invites.data.length > 0 ? (
        <InviteTable podId={podId} invites={invites.data} />
      ) : (
        <EmptyState
          title="No invitations yet"
          body="When you create one, it&rsquo;ll appear here with a copy-able link."
        />
      )}
    </main>
  )
}
