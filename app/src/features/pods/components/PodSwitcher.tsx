import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/DropdownMenu'
import { podsListQuery } from '../api/queries'
import { CreatePodDialog } from './CreatePodDialog'

const ChevronDown = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="pod-switcher__chevron"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export type PodSwitcherProps = {
  activePodId?: string
}

export const PodSwitcher = ({ activePodId }: PodSwitcherProps) => {
  const pods = useQuery(podsListQuery)
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)

  const active = activePodId
    ? pods.data?.find((p) => p.id === activePodId)
    : undefined

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="pod-switcher">
            <span className="pod-switcher__brand">Birds</span>
            <span aria-hidden="true" className="pod-switcher__separator" />
            <span className="pod-switcher__pod">
              {active ? active.name : 'Your vaults'}
            </span>
            <ChevronDown />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={10}>
          <DropdownMenuLabel>Your pods</DropdownMenuLabel>
          {pods.data?.map((pod) => (
            <DropdownMenuItem
              key={pod.id}
              onSelect={() =>
                void navigate({
                  to: '/pods/$podId',
                  params: { podId: pod.id },
                })
              }
            >
              <span className="pod-switcher__item">
                <span>{pod.name}</span>
                <span className="pod-switcher__item-role">{pod.role}</span>
              </span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setCreateOpen(true)}>
            New pod
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => void navigate({ to: '/pods' })}
          >
            See all pods
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreatePodDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
