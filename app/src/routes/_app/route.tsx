import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppShell } from '#/components/layout/AppShell'
import { meQuery } from '#/features/auth/queries'

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
