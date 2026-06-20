import { useEffect, useRef } from 'react'
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query'
import { EmptyState } from '#/components/ui/EmptyState'
import { Button } from '#/components/ui/Button'
import { memoriesInfiniteQuery } from '../queries'
import { MemoryCard } from './MemoryCard'
import type { Memory, MemoryListPage } from '../types'

export type MemoryFeedProps = {
  podId: string
  onCreateClick: () => void
  onMemoryClick: (memoryId: string) => void
}

export const MemoryFeed = ({ podId, onCreateClick, onMemoryClick }: MemoryFeedProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    memoriesInfiniteQuery(podId),
  )

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void fetchNextPage()
      },
      { threshold: 0.1 },
    )
    obs.observe(sentinelRef.current)
    return () => obs.disconnect()
  }, [hasNextPage, fetchNextPage])

  const pages = (data as InfiniteData<MemoryListPage> | undefined)?.pages
  const memories = pages?.flatMap((p) => p.memories) ?? []

  if (memories.length === 0) {
    return (
      <div className="memory-feed">
        <div className="memory-feed__header">
          <Button variant="gold" onClick={onCreateClick}>
            Add memory
          </Button>
        </div>
        <EmptyState
          eyebrow="Nothing here yet"
          title="Your first memory awaits."
          body="Every great story starts with a single moment. Add your first memory."
          action={null}
        />
      </div>
    )
  }

  return (
    <div className="memory-feed">
      <div className="memory-feed__header">
        <Button variant="gold" onClick={onCreateClick}>
          Add memory
        </Button>
      </div>
      {memories.map((memory: Memory) => (
        <MemoryCard
          key={memory.id}
          memory={memory}
          onClick={() => onMemoryClick(memory.id)}
        />
      ))}
      {hasNextPage && <div className="memory-feed__sentinel" ref={sentinelRef} />}
      {isFetchingNextPage && <div className="memory-feed__loading">Loading more…</div>}
    </div>
  )
}
