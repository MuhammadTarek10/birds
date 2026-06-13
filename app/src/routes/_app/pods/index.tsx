import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Text } from '#/components/ui/Text'
import { podsListQuery } from '#/features/pods/api/queries'
import { CreatePodDialog } from '#/features/pods/components/CreatePodDialog'
import { PodCard, PodCardGhost } from '#/features/pods/components/PodCard'

export const Route = createFileRoute('/_app/pods/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(podsListQuery),
  component: PodsIndex,
})

function PodsIndex() {
  const pods = useQuery(podsListQuery)
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <main className="pod-page">
      <header className="pod-page__header items-center text-center">
        <Text
          as="span"
          variant="label-md"
          className="pod-page__eyebrow"
        >
          Your vaults
        </Text>
        <Text
          as="h1"
          variant="display-lg"
          className="pod-page__title"
        >
          Your archive
        </Text>
        <Text
          variant="body-lg"
          className="text-on-surface-variant italic max-w-prose mx-auto"
        >
          Each pod is its own quiet room — one for the two of you, more for whoever
          you invite in.
        </Text>
      </header>
      <div className="pod-grid">
        {pods.data?.map((pod) => <PodCard key={pod.id} pod={pod} />)}
        <PodCardGhost onClick={() => setCreateOpen(true)} />
      </div>
      <CreatePodDialog open={createOpen} onOpenChange={setCreateOpen} />
    </main>
  )
}
