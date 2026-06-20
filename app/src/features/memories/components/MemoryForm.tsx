import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '#/components/ui/Button'
import { TextInput } from '#/components/ui/TextInput'
import { DatePicker } from '#/components/ui/DatePicker'
import { createMemorySchema, type CreateMemoryInput } from '../schemas/create-memory.schema'

export type MemoryFormProps = {
  defaultValues?: Partial<CreateMemoryInput>
  onSubmit: (values: CreateMemoryInput) => Promise<void>
  onCancel: () => void
  isPending?: boolean
  submitLabel?: string
}

export const MemoryForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isPending,
  submitLabel = 'Save memory',
}: MemoryFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateMemoryInput>({
    resolver: zodResolver(createMemorySchema),
    defaultValues: {
      title: '',
      eventDate: new Date().toISOString().slice(0, 10),
      ...defaultValues,
    },
  })

  const eventDate = watch('eventDate')

  return (
    <form className="memory-form" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="Title"
        error={errors.title?.message}
        autoFocus
        {...register('title')}
      />
      <DatePicker
        label="Date"
        value={eventDate}
        onChange={(val) => setValue('eventDate', val, { shouldValidate: true })}
        error={errors.eventDate?.message}
      />
      <TextInput
        label="Location (optional)"
        error={errors.location?.message}
        {...register('location')}
      />
      <textarea
        className="memory-form__textarea"
        placeholder="Description (optional)"
        rows={4}
        {...register('description')}
      />
      <div className="memory-form__footer">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="gold" type="submit" disabled={isSubmitting || isPending}>
          {isPending ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
