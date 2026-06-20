import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '#/components/ui/Dialog'
import { useUpdateMemory } from '../mutations'
import { MemoryForm } from './MemoryForm'
import type { Memory } from '../types'

export type EditMemoryDialogProps = {
  podId: string
  memory: Memory
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EditMemoryDialog = ({ podId, memory, open, onOpenChange }: EditMemoryDialogProps) => {
  const update = useUpdateMemory(podId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Edit memory</DialogTitle>
        <DialogDescription>Update the details of this moment.</DialogDescription>
        <MemoryForm
          defaultValues={{
            title: memory.title,
            eventDate: memory.eventDate,
            description: memory.description ?? '',
            location: memory.location ?? '',
          }}
          onSubmit={async (values) => {
            await update.mutateAsync({ id: memory.id, data: values })
            onOpenChange(false)
          }}
          onCancel={() => onOpenChange(false)}
          isPending={update.isPending}
          submitLabel="Save changes"
        />
      </DialogContent>
    </Dialog>
  )
}
