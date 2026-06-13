export type ResponseStatus = 'success' | 'error'

export type ResponseEnvelope<T> = {
  data: T
  message: string
  status: ResponseStatus
  error?: {
    code?: string
    details?: unknown
  }
}
