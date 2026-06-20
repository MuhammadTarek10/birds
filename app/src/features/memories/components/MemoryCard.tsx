import { MapPin } from 'lucide-react'
import { formatEventDate } from '#/lib/format/date'
import type { Memory } from '../types'

export type MemoryCardProps = {
  memory: Memory
  onClick: () => void
}

export const MemoryCard = ({ memory, onClick }: MemoryCardProps) => (
  <article
    className="memory-card"
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onClick()
    }}
  >
    <time className="memory-card__date" dateTime={memory.eventDate}>
      {formatEventDate(memory.eventDate)}
    </time>
    <h3 className="memory-card__title">{memory.title}</h3>
    {memory.location && (
      <span className="memory-card__location">
        <MapPin size={12} aria-hidden="true" />
        {memory.location}
      </span>
    )}
    <span className="memory-card__author">by {memory.author.name}</span>
  </article>
)
