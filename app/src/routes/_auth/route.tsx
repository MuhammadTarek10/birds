import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { meQuery } from '#/features/auth/api/queries'
import { AuthLayout } from '#/features/auth/components/AuthLayout'
import { readRedirect } from '#/features/auth/utils/redirect-param'

type AuthSearch = {
  redirect?: string
  invite?: string
}

export const Route = createFileRoute('/_auth')({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    redirect:
      typeof search.redirect === 'string' ? search.redirect : undefined,
    invite: typeof search.invite === 'string' ? search.invite : undefined,
  }),
  beforeLoad: async ({ context, search }) => {
    const me = await context.queryClient
      .ensureQueryData(meQuery)
      .catch(() => null)
    if (me) {
      throw redirect({ to: readRedirect(search) })
    }
  },
  component: AuthShell,
})

function AuthShell() {
  return (
    <AuthLayout
      rightEyebrow="Memory vault"
      rightHeadline="A quiet room for the two of you."
      rightLede="No likes, no feeds — only the letters, photos, and rituals you choose to keep."
    >
      <Outlet />
    </AuthLayout>
  )
}
