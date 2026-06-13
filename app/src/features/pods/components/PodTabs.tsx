import { Link, useLocation } from '@tanstack/react-router'
import { useLayoutEffect, useRef, useState } from 'react'

type TabKey = 'overview' | 'members' | 'invites' | 'settings'
type TabRoute =
  | '/pods/$podId'
  | '/pods/$podId/members'
  | '/pods/$podId/invites'
  | '/pods/$podId/settings'

const TABS: ReadonlyArray<{ key: TabKey; label: string; to: TabRoute }> = [
  { key: 'overview', label: 'Overview', to: '/pods/$podId' },
  { key: 'members', label: 'Members', to: '/pods/$podId/members' },
  { key: 'invites', label: 'Invites', to: '/pods/$podId/invites' },
  { key: 'settings', label: 'Settings', to: '/pods/$podId/settings' },
]

const activeTabFromPath = (pathname: string, podId: string): TabKey => {
  const base = `/pods/${podId}`
  if (pathname.startsWith(`${base}/members`)) return 'members'
  if (pathname.startsWith(`${base}/invites`)) return 'invites'
  if (pathname.startsWith(`${base}/settings`)) return 'settings'
  return 'overview'
}

export const PodTabs = ({ podId }: { podId: string }) => {
  const location = useLocation()
  const active = activeTabFromPath(location.pathname, podId)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const tabRefs = useRef<Record<TabKey, HTMLAnchorElement | null>>({
    overview: null,
    members: null,
    invites: null,
    settings: null,
  })
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const container = containerRef.current
    const el = tabRefs.current[active]
    if (!container || !el) return
    const containerBox = container.getBoundingClientRect()
    const elBox = el.getBoundingClientRect()
    setIndicator({ left: elBox.left - containerBox.left, width: elBox.width })
  }, [active])

  return (
    <nav ref={containerRef} className="pod-tabs" aria-label="Pod sections">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          ref={(el) => {
            tabRefs.current[tab.key] = el
          }}
          to={tab.to}
          params={{ podId }}
          className="pod-tabs__link"
          data-active={active === tab.key}
        >
          {tab.label}
        </Link>
      ))}
      <span
        aria-hidden="true"
        className="pod-tabs__indicator"
        ref={(node) => {
          if (!node) return
          node.style.setProperty('left', `${indicator.left}px`)
          node.style.setProperty('width', `${indicator.width}px`)
        }}
      />
    </nav>
  )
}
