import { useQuery } from '@tanstack/react-query'
import { commentsQuery } from '../queries'
import { CommentItem } from './CommentItem'
import { CommentComposer } from './CommentComposer'

export type CommentListProps = {
  memoryId: string
  currentUserId: string
}

export const CommentList = ({ memoryId, currentUserId }: CommentListProps) => {
  const { data: comments = [] } = useQuery(commentsQuery(memoryId))

  return (
    <section>
      <div className="comment-list">
        {comments.length === 0 && (
          <p className="comment-list__empty">
            No comments yet. Be the first to share a thought.
          </p>
        )}
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            memoryId={memoryId}
            currentUserId={currentUserId}
          />
        ))}
      </div>
      <CommentComposer memoryId={memoryId} />
    </section>
  )
}
