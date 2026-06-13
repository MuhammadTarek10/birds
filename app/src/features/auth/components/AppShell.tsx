import { Outlet, useParams } from '@tanstack/react-router'
import { Button } from '#/components/ui/Button'
import { LogOutIcon } from '#/components/ui/icons/LogOutIcon'
import { Text } from '#/components/ui/Text'
import { PodSwitcher } from '#/features/pods/components/PodSwitcher'
import { useLogout } from '../hooks/use-logout'
import { useMe } from '../hooks/use-me'

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
  const params = useParams({ strict: false })

  return (
    <div className="appshell">
      <header className="appshell-header">
        <PodSwitcher activePodId={params.podId} />
        <div className="appshell-actions">
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
