import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '#/components/ui/Button'
import { Text } from '#/components/ui/Text'
import { TextInput } from '#/components/ui/TextInput'
import { useCreateInvite } from '../mutations'
import {
  EXPIRY_OPTIONS,
  createInviteSchema
  
} from '../schemas/create-invite.schema'
import type {CreateInviteInput} from '../schemas/create-invite.schema';

export const CreateInviteForm = ({ podId }: { podId: string }) => {
  const create = useCreateInvite(podId)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateInviteInput>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: { email: undefined, expiresInHours: 168 },
  })

  return (
    <form
      className="invite-create"
      onSubmit={handleSubmit(async (values) => {
        await create.mutateAsync({
          email: values.email,
          expiresInHours: values.expiresInHours,
        })
        reset({ email: undefined, expiresInHours: 168 })
      })}
    >
      <Text as="h2" variant="title-md" className="auth-card__headline">
        Send an invitation
      </Text>
      <Text variant="body-md" className="auth-card__lede">
        Optionally lock the link to one email. Otherwise anyone with the link can join.
      </Text>
      <TextInput
        label="Target email (optional)"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Controller
        control={control}
        name="expiresInHours"
        render={({ field }) => (
          <div
            role="radiogroup"
            aria-label="Expires in"
            className="invite-create__expiry"
          >
            {EXPIRY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="invite-create__expiry-option"
                data-active={field.value === opt.value}
                onClick={() => field.onChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      />
      <div className="invite-create__footer">
        <Button
          type="submit"
          variant="gold"
          disabled={isSubmitting || create.isPending}
        >
          {create.isPending ? 'Sealing…' : 'Create invitation'}
        </Button>
      </div>
    </form>
  )
}
