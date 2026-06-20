import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '#/components/ui/Dialog'
import { useCreateMemory } from '../mutations'
import { MemoryForm } from './MemoryForm'

export type CreateMemoryDialogProps = {
  podId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CreateMemoryDialog = ({ podId, open, onOpenChange }: CreateMemoryDialogProps) => {
  const create = useCreateMemory(podId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Add a memory</DialogTitle>
        <DialogDescription>Capture this moment in your pod's timeline.</DialogDescription>
        <MemoryForm
          onSubmit={async (values) => {
            await create.mutateAsync(values)
            onOpenChange(false)
          }}
          onCancel={() => onOpenChange(false)}
          isPending={create.isPending}
        />
      </DialogContent>
    </Dialog>
  )
}
