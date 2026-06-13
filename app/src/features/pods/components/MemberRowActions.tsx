import { useState } from 'react'
import { Button } from '#/components/ui/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '#/components/ui/Dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/DropdownMenu'
import { cx } from '#/lib/cx'
import {
  useLeavePod,
  useRemoveMember,
  useUpdateMemberRole,
} from '../api/mutations'
import type { PodMember } from '../api/queries'
import { displayName } from '../utils/name'

const Kebab = ({ size = 18 }: { size?: number }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="5" r="1.25" />
    <circle cx="12" cy="12" r="1.25" />
    <circle cx="12" cy="19" r="1.25" />
  </svg>
)

export type MemberRowActionsProps = {
  podId: string
  member: PodMember
  viewerUserId: string
  viewerIsAdmin: boolean
}

type ConfirmAction = 'remove' | 'leave' | null

export const MemberRowActions = ({
  podId,
  member,
  viewerUserId,
  viewerIsAdmin,
}: MemberRowActionsProps) => {
  const [confirm, setConfirm] = useState<ConfirmAction>(null)

  const updateRole = useUpdateMemberRole(podId)
  const remove = useRemoveMember(podId)
  const leave = useLeavePod(podId)

  const isSelf = member.user.id === viewerUserId

  const canShowMenu = viewerIsAdmin || isSelf
  if (!canShowMenu) return null

  const promote = () =>
    updateRole.mutate({ targetUserId: member.user.id, role: 'admin' })
  const demote = () =>
    updateRole.mutate({ targetUserId: member.user.id, role: 'member' })

  const confirmTitle =
    confirm === 'leave' ? 'Leave this pod?' : 'Remove from pod?'
  const confirmBody =
    confirm === 'leave'
      ? 'You can be re-invited at any time.'
      : `${displayName(member.user)} will lose access to this pod.`

  const onConfirm = () => {
    if (confirm === 'leave') {
      leave.mutate(viewerUserId)
    } else if (confirm === 'remove') {
      remove.mutate(member.user.id)
    }
    setConfirm(null)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cx('btn', 'btn--icon')}
            aria-label="Member actions"
          >
            <Kebab />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {viewerIsAdmin && !isSelf ? (
            member.role === 'member' ? (
              <DropdownMenuItem onSelect={promote}>Make admin</DropdownMenuItem>
            ) : (
              <DropdownMenuItem onSelect={demote}>
                Demote to member
              </DropdownMenuItem>
            )
          ) : null}
          {viewerIsAdmin && !isSelf ? (
            <DropdownMenuItem tone="danger" onSelect={() => setConfirm('remove')}>
              Remove from pod
            </DropdownMenuItem>
          ) : null}
          {isSelf ? (
            <DropdownMenuItem tone="danger" onSelect={() => setConfirm('leave')}>
              Leave pod
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={confirm !== null}
        onOpenChange={(open) => !open && setConfirm(null)}
      >
        <DialogContent>
          <DialogTitle>{confirmTitle}</DialogTitle>
          <DialogDescription>{confirmBody}</DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="primary" type="button" onClick={onConfirm} className="btn--danger">
              {confirm === 'leave' ? 'Leave pod' : 'Remove member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

