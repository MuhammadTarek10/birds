import { useRef } from 'react'
import { Button } from '#/components/ui/Button'
import { useCreateComment } from '../mutations'

export type CommentComposerProps = {
  memoryId: string
}

export const CommentComposer = ({ memoryId }: CommentComposerProps) => {
  const create = useCreateComment(memoryId)
  const ref = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    const content = ref.current?.value.trim() ?? ''
    if (!content) return
    create.mutate(content, {
      onSuccess: () => {
        if (ref.current) ref.current.value = ''
      },
    })
  }

  return (
    <div className="comment-composer">
      <textarea
        ref={ref}
        className="comment-composer__field"
        placeholder="Write a comment…"
        rows={3}
        disabled={create.isPending}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
        }}
      />
      <div className="comment-composer__footer">
        <Button variant="primary" size="sm" onClick={handleSubmit} disabled={create.isPending}>
          {create.isPending ? 'Posting…' : 'Post'}
        </Button>
      </div>
    </div>
  )
}
