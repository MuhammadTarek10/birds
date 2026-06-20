import { useState } from 'react'
import { formatCommentTime } from '#/lib/format/date'
import { Button } from '#/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/DropdownMenu'
import { useDeleteComment, useUpdateComment } from '../mutations'
import type { Comment } from '../types'

export type CommentItemProps = {
  comment: Comment
  memoryId: string
  currentUserId: string
}

export const CommentItem = ({ comment, memoryId, currentUserId }: CommentItemProps) => {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(comment.content)
  const update = useUpdateComment()
  const del = useDeleteComment(memoryId)
  const isOwn = comment.userId === currentUserId
  const isTemp = comment.id.startsWith('temp-')

  const handleUpdate = async () => {
    if (editValue.trim()) {
      await update.mutateAsync({ id: comment.id, content: editValue.trim() })
    }
    setEditing(false)
  }

  return (
    <div className={`comment-item${isTemp ? ' comment-item--temp' : ''}`}>
      <div className="comment-item__header">
        <span className="comment-item__author">{comment.author.name}</span>
        <div className="comment-item__actions">
          <time className="comment-item__time">{formatCommentTime(comment.createdAt)}</time>
          {isOwn && !isTemp && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="btn btn--icon btn--sm" aria-label="Comment actions">
                  ···
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onSelect={() => {
                    setEditing(true)
                    setEditValue(comment.content)
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem tone="danger" onSelect={() => del.mutate(comment.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {editing ? (
        <div className="comment-item__body">
          <textarea
            className="comment-composer__field"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={3}
            autoFocus
          />
          <div className="comment-composer__footer">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleUpdate} disabled={update.isPending}>
              {update.isPending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      ) : (
        <p className="comment-item__body">{comment.content}</p>
      )}
    </div>
  )
}
