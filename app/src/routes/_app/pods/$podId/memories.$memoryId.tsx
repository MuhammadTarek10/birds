import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { MapPin } from 'lucide-react'
import { useMe } from '#/features/auth/hooks/use-me'
import { Button } from '#/components/ui/Button'
import { Text } from '#/components/ui/Text'
import { formatEventDate } from '#/lib/format/date'
import { memoryDetailQuery, commentsQuery } from '#/features/memories/queries'
import { CommentList } from '#/features/memories/components/CommentList'
import { EditMemoryDialog } from '#/features/memories/components/EditMemoryDialog'
import { DeleteMemoryConfirm } from '#/features/memories/components/DeleteMemoryConfirm'

export const Route = createFileRoute('/_app/pods/$podId/memories/$memoryId')({
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(memoryDetailQuery(params.memoryId)),
      context.queryClient.ensureQueryData(commentsQuery(params.memoryId)),
    ])
  },
  component: MemoryDetailPage,
})

function MemoryDetailPage() {
  console.log('Rendering MemoryDetailPage')
  const { podId, memoryId } = Route.useParams()
  const me = useMe()
  const { data: memory } = useQuery(memoryDetailQuery(memoryId))
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!memory || !me.data) return null

  const isAuthor = memory.userId === me.data.id

  return (
    <main className="pod-page">
      <div className="memory-detail">
        <div className="memory-detail__header">
          <time className="memory-detail__date" dateTime={memory.eventDate}>
            {formatEventDate(memory.eventDate)}
          </time>
          <Text as="h1" variant="headline-lg" className="memory-detail__title">
            {memory.title}
          </Text>
          <div className="memory-detail__meta">
            <span>by {memory.author.name}</span>
            {memory.location && (
              <span className="memory-detail__location">
                <MapPin size={12} aria-hidden="true" />
                {memory.location}
              </span>
            )}
          </div>
        </div>
        {memory.description && (
          <p className="memory-detail__body">{memory.description}</p>
        )}
        {isAuthor && (
          <div className="memory-detail__actions">
            <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)}>
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="btn--danger"
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>
        )}
        <CommentList memoryId={memoryId} currentUserId={me.data.id} />
      </div>
      {isAuthor && (
        <>
          <EditMemoryDialog
            podId={podId}
            memory={memory}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <DeleteMemoryConfirm
            podId={podId}
            memoryId={memoryId}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </>
      )}
    </main>
  )
}
