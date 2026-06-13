import { http } from '#/lib/api/http'
import { endpoints } from '#/lib/api/endpoints'
import type { PodMember, PodRole, PodSummary } from '../types'

type Opts = { signal?: AbortSignal }

export const podsService = {
  list: (opts: Opts = {}): Promise<Array<PodSummary>> =>
    http
      .get<{ pods: Array<PodSummary> }>(endpoints.pods.list, opts)
      .then((d) => d.pods),
  detail: (id: string, opts: Opts = {}): Promise<PodSummary> =>
    http.get<PodSummary>(endpoints.pods.detail(id), opts),
  members: (id: string, opts: Opts = {}): Promise<Array<PodMember>> =>
    http
      .get<{ members: Array<PodMember> }>(endpoints.pods.members(id), opts)
      .then((d) => d.members),
  create: (name: string): Promise<PodSummary> =>
    http.post<PodSummary>(endpoints.pods.list, { name }),
  rename: (id: string, name: string): Promise<PodSummary> =>
    http.patch<PodSummary>(endpoints.pods.detail(id), { name }),
  updateRole: (id: string, uid: string, role: PodRole): Promise<PodMember> =>
    http.patch<PodMember>(endpoints.pods.member(id, uid), { role }),
  removeMember: (id: string, uid: string): Promise<void> =>
    http.delete<void>(endpoints.pods.member(id, uid)),
}
