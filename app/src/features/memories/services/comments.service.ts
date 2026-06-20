import { http } from '#/lib/api/http'
import { endpoints } from '#/lib/api/endpoints'
import type { Comment } from '../types'

type Opts = { signal?: AbortSignal }

export const commentsService = {
  list: (memoryId: string, opts: Opts = {}): Promise<Comment[]> =>
    http.get<Comment[]>(endpoints.memories.comments(memoryId), opts),
  create: (memoryId: string, data: { content: string }): Promise<Comment> =>
    http.post<Comment>(endpoints.memories.comments(memoryId), data),
  update: (id: string, data: { content: string }): Promise<Comment> =>
    http.patch<Comment>(endpoints.memories.comment(id), data),
  delete: (id: string): Promise<void> =>
    http.delete<void>(endpoints.memories.comment(id)),
}
