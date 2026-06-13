import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '#/components/ui/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '#/components/ui/Dialog'
import { TextInput } from '#/components/ui/TextInput'
import { useCreatePod } from '../api/mutations'
import { podNameSchema  } from '../schemas/pod-name.schema'
import type {PodNameInput} from '../schemas/pod-name.schema';

export type CreatePodDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CreatePodDialog = ({
  open,
  onOpenChange,
}: CreatePodDialogProps) => {
  const create = useCreatePod()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PodNameInput>({
    resolver: zodResolver(podNameSchema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (!open) reset({ name: '' })
  }, [open, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Begin a new pod</DialogTitle>
        <DialogDescription>
          Give your vault a name. You can rename it later.
        </DialogDescription>
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(async (values) => {
            await create.mutateAsync(values.name)
            onOpenChange(false)
          })}
        >
          <TextInput
            label="Pod name"
            error={errors.name?.message}
            autoFocus
            {...register('name')}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="gold"
              disabled={isSubmitting || create.isPending}
            >
              {create.isPending ? 'Creating…' : 'Create pod'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
