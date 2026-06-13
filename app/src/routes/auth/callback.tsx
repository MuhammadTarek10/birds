import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '#/components/ui/Button'
import { Text } from '#/components/ui/Text'
import { meQuery } from '#/features/auth/queries'
import { authKeys } from '#/features/auth/keys'
import { AuthCard } from '#/features/auth/components/AuthCard'
import { AuthError } from '#/features/auth/components/AuthError'
import { AuthLayout } from '#/features/auth/components/AuthLayout'
import { readPostAuthRedirect } from '#/features/auth/components/GoogleButton'

type CallbackSearch = { error?: string }

export const Route = createFileRoute('/auth/callback')({
  validateSearch: (search: Record<string, unknown>): CallbackSearch => ({
    error: typeof search.error === 'string' ? search.error : undefined,
  }),
  component: CallbackPage,
})

function CallbackPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (search.error) return
    void (async () => {
      queryClient.removeQueries({ queryKey: authKeys.me })
      await queryClient.fetchQuery(meQuery)
      await navigate({ to: readPostAuthRedirect() })
    })()
  }, [navigate, queryClient, search.error])

  if (search.error) {
    return (
      <AuthLayout
        rightEyebrow="A small interruption"
        rightHeadline="Even letters get lost in the post."
        rightLede="Try again — your room is still waiting."
      >
        <AuthCard
        eyebrow="Almost there"
        headline="We couldn't sign you in"
        lede="Google returned an error. Try again, or use email and password."
        footer={
          <Link to="/login" className="auth-card__link">
            <Text as="span" variant="label-md">
              Back to sign in
            </Text>
          </Link>
        }
      >
        <AuthError error={new Error(decodeURIComponent(search.error))} />
          <Button variant="ghost" onClick={() => navigate({ to: '/login' })}>
            Try again
          </Button>
        </AuthCard>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      rightEyebrow="Memory vault"
      rightHeadline="A quiet room for the two of you."
      rightLede="No likes, no feeds — only the letters, photos, and rituals you choose to keep."
    >
      <AuthCard
        eyebrow="Connecting…"
        headline="One moment, please."
        lede="We're signing you in."
      >
        <div className="auth-card__loading">
          <span className="auth-loading-orb" aria-hidden="true" />
        </div>
      </AuthCard>
    </AuthLayout>
  )
}
