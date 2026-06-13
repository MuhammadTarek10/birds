import { http } from '#/lib/api/http'
import { endpoints } from '#/lib/api/endpoints'
import type { Me } from '../types'
import type { LoginInput } from '../schemas/login.schema'
import type { RegisterInput } from '../schemas/register.schema'

type Opts = { signal?: AbortSignal }

export const authService = {
  me: (opts: Opts = {}): Promise<Me> =>
    http.get<Me>(endpoints.auth.me, opts),
  login: (input: LoginInput): Promise<void> =>
    http.post<void>(endpoints.auth.login, input),
  register: (input: RegisterInput): Promise<void> =>
    http.post<void>(endpoints.auth.register, input),
  logout: (): Promise<void> =>
    http.post<void>(endpoints.auth.logout),
}
