import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '#/components/ui/Button'
import { ChevronRightIcon } from '#/components/ui/icons/ChevronRightIcon'
import { Text } from '#/components/ui/Text'
import { TextInput } from '#/components/ui/TextInput'
import { AuthCard } from '#/features/auth/components/AuthCard'
import { AuthError } from '#/features/auth/components/AuthError'
import { GoogleButton } from '#/features/auth/components/GoogleButton'
import { useRegister } from '#/features/auth/hooks/use-register'
import {
  cleanRegisterPayload,
  registerSchema,
} from '#/features/auth/schemas/register.schema'
import type { RegisterInput } from '#/features/auth/schemas/register.schema'
import { readRedirect } from '#/features/auth/utils/redirect-param'
import { invitePreviewQuery } from '#/features/invites/api/queries'

export const Route = createFileRoute('/_auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const search = Route.useSearch()
  const redirectTo = readRedirect(search)
  const inviteToken = search.invite

  const invite = useQuery({
    ...invitePreviewQuery(inviteToken ?? ''),
    enabled: Boolean(inviteToken),
  })

  const registerMutation = useRegister(redirectTo)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      inviteToken: inviteToken ?? '',
    },
  })

  return (
    <AuthCard
      eyebrow="Create your vault"
      headline="Begin your archive"
      lede="Two names, one quiet room."
      footer={
        <Link to="/login" className="auth-card__link">
          <Text as="span" variant="label-md">
            Already have a vault? Sign in
          </Text>
          <ChevronRightIcon size="sm" tone="gold" />
        </Link>
      }
    >
      {inviteToken && invite.data ? (
        <div className="auth-card__invite">
          <Text as="span" variant="body-md">
            You&rsquo;ve been invited to <em>{invite.data.podName}</em>.
          </Text>
        </div>
      ) : null}
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit((values) =>
          registerMutation.mutate(
            cleanRegisterPayload({
              ...values,
              inviteToken: inviteToken ?? values.inviteToken,
            }),
          ),
        )}
        noValidate
      >
        <AuthError error={registerMutation.error} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextInput
            label="First name"
            autoComplete="given-name"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <TextInput
            label="Last name"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>
        <TextInput
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextInput
          label="Password"
          type="password"
          autoComplete="new-password"
          help="At least 8 characters."
          error={errors.password?.message}
          {...register('password')}
        />
        <Button
          type="submit"
          variant="gold"
          disabled={isSubmitting || registerMutation.isPending}
        >
          {registerMutation.isPending ? 'Creating your vault…' : 'Create vault'}
        </Button>
        <div className="auth-card__divider">or</div>
        <GoogleButton redirectTo={redirectTo} />
      </form>
    </AuthCard>
  )
}
