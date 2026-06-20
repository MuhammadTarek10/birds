import { http } from '#/lib/api/http'
import { endpoints } from '#/lib/api/endpoints'
import type { Memory, MemoryListPage } from '../types'

type Opts = { signal?: AbortSignal }

export const memoriesService = {
  list: (podId: string, opts: { cursor?: string | null; signal?: AbortSignal } = {}): Promise<MemoryListPage> => {
    const params = new URLSearchParams()
    if (opts.cursor) params.set('cursor', opts.cursor)
    const qs = params.toString()
    const url = qs ? `${endpoints.memories.list(podId)}?${qs}` : endpoints.memories.list(podId)
    return http.get<MemoryListPage>(url, { signal: opts.signal })
  },
  detail: (id: string, opts: Opts = {}): Promise<Memory> =>
    http.get<Memory>(endpoints.memories.detail(id), opts),
  create: (podId: string, data: { title: string; eventDate: string; description?: string; location?: string }): Promise<Memory> =>
    http.post<Memory>(endpoints.memories.create(podId), data),
  update: (id: string, data: { title?: string; eventDate?: string; description?: string; location?: string }): Promise<Memory> =>
    http.patch<Memory>(endpoints.memories.detail(id), data),
  delete: (id: string): Promise<void> =>
    http.delete<void>(endpoints.memories.detail(id)),
}
