import { env } from '#/lib/env'
import type { AxiosError } from 'axios';
import axios from 'axios'
import { ApiError } from './error'
import type { ResponseEnvelope } from './types'

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => {
    const body = res.data as ResponseEnvelope<unknown> | unknown
    if (body && typeof body === 'object' && 'data' in body) {
      res.data = (body as ResponseEnvelope<unknown>).data
    }
    return res
  },
  (err: AxiosError<ResponseEnvelope<unknown>>) => {
    const body = err.response?.data
    throw new ApiError({
      status: err.response?.status ?? 0,
      code: body?.error?.code,
      message: body?.message ?? err.message,
      details: body?.error?.details,
    })
  },
)
