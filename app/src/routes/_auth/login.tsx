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
import { useLogin } from '#/features/auth/hooks/use-login'
import { loginSchema } from '#/features/auth/schemas/login.schema'
import type { LoginInput } from '#/features/auth/schemas/login.schema'
import { readRedirect } from '#/features/auth/utils/redirect-param'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const search = Route.useSearch()
  const redirectTo = readRedirect(search)
  const login = useLogin(redirectTo)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <AuthCard
      eyebrow="Welcome back"
      headline="Sign in"
      lede="A small return to the room you two share."
      footer={
        <Link to="/register" className="auth-card__link">
          <Text as="span" variant="label-md">
            New here? Begin your archive
          </Text>
          <ChevronRightIcon size="sm" tone="gold" />
        </Link>
      }
    >
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit((values) => login.mutate(values))}
        noValidate
      >
        <AuthError error={login.error} />
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
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button
          type="submit"
          variant="gold"
          disabled={isSubmitting || login.isPending}
        >
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </Button>
        <div className="auth-card__divider">or</div>
        <GoogleButton redirectTo={redirectTo} />
      </form>
    </AuthCard>
  )
}
