import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '#/components/ui/Button'
import { Text } from '#/components/ui/Text'
import { TextInput } from '#/components/ui/TextInput'
import { useRenamePod } from '../mutations'
import type { PodSummary } from '../types'
import { podNameSchema  } from '../schemas/pod-name.schema'
import type {PodNameInput} from '../schemas/pod-name.schema';

export const RenamePodCard = ({ pod }: { pod: PodSummary }) => {
  const rename = useRenamePod(pod.id)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<PodNameInput>({
    resolver: zodResolver(podNameSchema),
    defaultValues: { name: pod.name },
  })

  useEffect(() => {
    reset({ name: pod.name })
  }, [pod.name, reset])

  return (
    <section className="auth-card">
      <Text as="span" variant="label-md" className="auth-card__eyebrow">
        Pod name
      </Text>
      <Text as="h2" variant="title-md" className="auth-card__headline">
        Rename this pod
      </Text>
      <Text variant="body-md" className="auth-card__lede">
        Pick a name that feels like the room you share.
      </Text>
      <form
        className="auth-card__form"
        onSubmit={handleSubmit((values) => rename.mutate(values.name))}
      >
        <TextInput
          label="Pod name"
          error={errors.name?.message}
          {...register('name')}
        />
        <div className="auth-card__action-footer">
          <Button
            type="submit"
            variant="gold"
            disabled={!isDirty || isSubmitting || rename.isPending}
          >
            {rename.isPending ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </form>
    </section>
  )
}
