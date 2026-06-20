import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Text } from '#/components/ui/Text'
import { memoriesInfiniteQuery } from '#/features/memories/queries'
import { MemoryFeed } from '#/features/memories/components/MemoryFeed'
import { CreateMemoryDialog } from '#/features/memories/components/CreateMemoryDialog'

export const Route = createFileRoute('/_app/pods/$podId/memories/')({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureInfiniteQueryData(
      memoriesInfiniteQuery(params.podId),
    )
  },
  component: MemoriesIndexPage,
})

function MemoriesIndexPage() {
  const { podId } = Route.useParams()
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <main className="pod-page">
      <header className="pod-page__header">
        <Text as="span" variant="label-md" className="pod-page__eyebrow">
          Memories
        </Text>
        <Text as="h1" variant="headline-lg" className="pod-page__title">
          Your timeline
        </Text>
      </header>
      <MemoryFeed
        podId={podId}
        onCreateClick={() => setCreateOpen(true)}
        onMemoryClick={(memoryId) =>
          void navigate({
            to: '/pods/$podId/memories/$memoryId',
            params: { podId, memoryId },
          })
        }
      />
      <CreateMemoryDialog
        podId={podId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </main>
  )
}
