import { Outlet } from '@tanstack/react-router'
import { Button } from '#/components/ui/Button'
import { ThemeToggle } from '#/components/ui/ThemeToggle'
import { LogOutIcon } from '#/components/ui/icons/LogOutIcon'
import { Text } from '#/components/ui/Text'
import { useLogout } from '#/features/auth/hooks/use-logout'
import { useMe } from '#/features/auth/hooks/use-me'
import { PodSwitcher } from '#/features/pods/components/PodSwitcher'
import { usePodIdFromUrl } from '#/features/pods/hooks/use-pod-id-from-url'

const initialsOf = (me: {
  firstName: string | null
  lastName: string | null
  email: string
}) => {
  const first = me.firstName?.trim()[0]
  const last = me.lastName?.trim()[0]
  if (first || last) return `${first ?? ''}${last ?? ''}`.toUpperCase()
  return me.email.slice(0, 2).toUpperCase()
}

export const AppShell = () => {
  const me = useMe()
  const logout = useLogout()
  const activePodId = usePodIdFromUrl()

  return (
    <div className="appshell">
      <header className="appshell-header">
        <PodSwitcher activePodId={activePodId} />
        <div className="appshell-actions">
          <ThemeToggle />
          {me.data ? (
            <div className="appshell-identity">
              <span className="appshell-avatar" aria-hidden="true">
                {initialsOf(me.data)}
              </span>
              <Text as="span" variant="label-md" className="appshell-email">
                {me.data.email}
              </Text>
            </div>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <LogOutIcon size="sm" tone="current" />
            Sign out
          </Button>
        </div>
      </header>
      <div className="appshell-content">
        <Outlet />
      </div>
    </div>
  )
}
