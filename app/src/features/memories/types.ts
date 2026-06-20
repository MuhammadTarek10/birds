export type MemoryAuthor = {
  id: string
  name: string
}

export type Memory = {
  id: string
  podId: string
  userId: string
  title: string
  description: string | null
  location: string | null
  eventDate: string    // ISO date string e.g. "2026-06-20"
  createdAt: string
  updatedAt: string | null
  author: MemoryAuthor
}

export type MemoryListPage = {
  memories: Memory[]
  nextCursor: string | null
}

export type CommentAuthor = {
  id: string
  name: string
}

export type Comment = {
  id: string
  memoryId: string
  userId: string
  content: string
  createdAt: string
  updatedAt: string | null
  author: CommentAuthor
}
