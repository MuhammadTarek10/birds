import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import { env } from '#/lib/env'
import { ApiError } from './error'
import { endpoints } from './endpoints'
import type { ResponseEnvelope } from './types'
import { sessionEnded } from './unauthenticated'

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

const REFRESH_SAFE = new Set<string>([
  endpoints.auth.refresh,
  endpoints.auth.login,
  endpoints.auth.register,
])

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

let refreshPromise: Promise<void> | null = null

const refreshOnce = (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = api
      .post('/auth/refresh')
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

const toApiError = (
  err: AxiosError<ResponseEnvelope<unknown>>,
): ApiError => {
  const body = err.response?.data
  return new ApiError({
    status: err.response?.status ?? 0,
    code: body?.error?.code,
    message: body?.message ?? err.message,
    details: body?.error?.details,
  })
}

api.interceptors.response.use(
  (res: AxiosResponse) => {
    const body = res.data as ResponseEnvelope<unknown> | unknown
    if (body && typeof body === 'object' && 'data' in body) {
      res.data = (body as ResponseEnvelope<unknown>).data
    }
    return res
  },
  async (err: AxiosError<ResponseEnvelope<unknown>>) => {
    const cfg = err.config as RetriableConfig | undefined
    const url = cfg?.url ?? ''
    const status = err.response?.status

    if (
      status === 401 &&
      cfg &&
      !cfg._retried &&
      !REFRESH_SAFE.has(url)
    ) {
      cfg._retried = true
      try {
        await refreshOnce()
        return await api.request(cfg)
      } catch {
        sessionEnded.emit()
      }
    }

    throw toApiError(err)
  },
)
