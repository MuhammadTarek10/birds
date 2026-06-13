import { api } from './client'

type Opts = { signal?: AbortSignal }

export const http = {
  get: <T>(url: string, opts: Opts = {}): Promise<T> =>
    api.get<T>(url, { signal: opts.signal }).then((r) => r.data),
  post: <T = void>(url: string, data?: unknown): Promise<T> =>
    api.post<T>(url, data).then((r) => r.data),
  patch: <T>(url: string, data?: unknown, opts: Opts = {}): Promise<T> =>
    api.patch<T>(url, data, { signal: opts.signal }).then((r) => r.data),
  delete: <T = void>(url: string): Promise<T> =>
    api.delete<T>(url).then((r) => r.data),
}
