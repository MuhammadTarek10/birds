import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { meQuery } from '#/features/auth/api/queries'
import { AuthCard } from '#/features/auth/components/AuthCard'
import { AuthError } from '#/features/auth/components/AuthError'
import { AuthLayout } from '#/features/auth/components/AuthLayout'
import { useRedeemInvite } from '#/features/invites/api/mutations'

export const Route = createFileRoute('/invite/$token')({
  beforeLoad: async ({ context, params }) => {
    const me = await context.queryClient
      .ensureQueryData(meQuery)
      .catch(() => null)
    if (!me) {
      throw redirect({
        to: '/register',
        search: { invite: params.token },
      })
    }
  },
  component: InviteRedeemPage,
})

function InviteRedeemPage() {
  const { token } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const redeem = useRedeemInvite()

  useEffect(() => {
    void (async () => {
      try {
        await redeem.mutateAsync(token)
        await queryClient.invalidateQueries()
        await navigate({ to: '/' })
      } catch {
        /* error rendered below */
      }
    })()
  }, [navigate, queryClient, redeem, token])

  return (
    <AuthLayout
      rightEyebrow="An invitation"
      rightHeadline="Stepping into a shared room."
      rightLede="One vault, two keepers."
    >
      <AuthCard
        eyebrow="Joining"
        headline={redeem.isError ? "We couldn't join you" : 'Redeeming your invite…'}
        lede={
          redeem.isError
            ? 'The invitation may be expired, revoked, or already used.'
            : 'A moment while we open the door.'
        }
      >
        {redeem.isError ? (
          <AuthError error={redeem.error} />
        ) : (
          <div className="py-6">
            <span className="auth-loading-orb" aria-hidden="true" />
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  )
}
