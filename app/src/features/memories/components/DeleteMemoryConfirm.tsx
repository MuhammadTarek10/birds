import { Button } from '#/components/ui/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '#/components/ui/Dialog'
import { useDeleteMemory } from '../mutations'

export type DeleteMemoryConfirmProps = {
  podId: string
  memoryId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const DeleteMemoryConfirm = ({
  podId,
  memoryId,
  open,
  onOpenChange,
}: DeleteMemoryConfirmProps) => {
  const del = useDeleteMemory(podId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Delete this memory?</DialogTitle>
        <DialogDescription>
          This will permanently remove the memory and all its comments.
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => del.mutate(memoryId)}
            disabled={del.isPending}
            className="btn--danger"
          >
            {del.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
