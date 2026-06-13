import { useState } from 'react'
import { Button } from '#/components/ui/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '#/components/ui/Dialog'
import { Text } from '#/components/ui/Text'
import { useLeavePod } from '../mutations'

export type LeavePodCardProps = {
  podId: string
  currentUserId: string
  podName: string
}

export const LeavePodCard = ({
  podId,
  currentUserId,
  podName,
}: LeavePodCardProps) => {
  const [open, setOpen] = useState(false)
  const leave = useLeavePod(podId)

  return (
    <section className="auth-card">
      <Text as="span" variant="label-md" className="auth-card__eyebrow">
        Danger
      </Text>
      <Text as="h2" variant="title-md" className="auth-card__headline">
        Leave this pod
      </Text>
      <Text variant="body-md" className="auth-card__lede">
        You&rsquo;ll lose access to {podName}. An admin can re-invite you.
      </Text>
      <div className="auth-card__action-footer">
        <Button
          type="button"
          variant="primary"
          className="btn--danger"
          onClick={() => setOpen(true)}
        >
          Leave pod
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Leave {podName}?</DialogTitle>
          <DialogDescription>
            You can be re-invited at any time.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="primary"
              className="btn--danger"
              onClick={() => {
                leave.mutate(currentUserId)
                setOpen(false)
              }}
            >
              Leave pod
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
