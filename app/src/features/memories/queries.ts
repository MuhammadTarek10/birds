import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { memoryKeys } from './keys'
import { memoriesService } from './services/memories.service'
import { commentsService } from './services/comments.service'
import type { Comment, Memory, MemoryListPage } from './types'

export const memoriesInfiniteQuery = (podId: string) =>
  infiniteQueryOptions<MemoryListPage, Error, MemoryListPage, ReturnType<typeof memoryKeys.all>, string | null>({
    queryKey: memoryKeys.all(podId),
    queryFn: ({ pageParam, signal }) =>
      memoriesService.list(podId, { cursor: pageParam, signal }),
    initialPageParam: null,
    getNextPageParam: (last) => last.nextCursor,
    staleTime: 30_000,
  })

export const memoryDetailQuery = (id: string) =>
  queryOptions<Memory>({
    queryKey: memoryKeys.detail(id),
    queryFn: ({ signal }) => memoriesService.detail(id, { signal }),
    staleTime: 30_000,
    enabled: id.length > 0,
    meta: { silent: true },
  })

export const commentsQuery = (memoryId: string) =>
  queryOptions<Comment[]>({
    queryKey: memoryKeys.comments(memoryId),
    queryFn: ({ signal }) => commentsService.list(memoryId, { signal }),
    staleTime: 30_000,
    enabled: memoryId.length > 0,
  })
