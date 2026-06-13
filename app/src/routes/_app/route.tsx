import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppShell } from '#/features/auth/components/AppShell'
import { meQuery } from '#/features/auth/api/queries'

export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ context, location }) => {
    const me = await context.queryClient
      .ensureQueryData(meQuery)
      .catch(() => null)
    if (!me) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
  component: AppShell,
})
