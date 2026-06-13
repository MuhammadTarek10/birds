import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Text } from '#/components/ui/Text'
import { useMe } from '#/features/auth/hooks/use-me'
import { podDetailQuery } from '#/features/pods/queries'
import { LeavePodCard } from '#/features/pods/components/LeavePodCard'
import { RenamePodCard } from '#/features/pods/components/RenamePodCard'

export const Route = createFileRoute('/_app/pods/$podId/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { podId } = Route.useParams()
  const pod = useQuery(podDetailQuery(podId))
  const me = useMe()

  if (!pod.data || !me.data) return null

  return (
    <main className="pod-page">
      <header className="pod-page__header">
        <Text as="span" variant="label-md" className="pod-page__eyebrow">
          Settings
        </Text>
        <Text as="h1" variant="headline-lg" className="pod-page__title">
          {pod.data.name}
        </Text>
      </header>
      <div className="settings-page__cards">
        {pod.data.role === 'admin' ? <RenamePodCard pod={pod.data} /> : null}
        <LeavePodCard
          podId={podId}
          currentUserId={me.data.id}
          podName={pod.data.name}
        />
      </div>
    </main>
  )
}
