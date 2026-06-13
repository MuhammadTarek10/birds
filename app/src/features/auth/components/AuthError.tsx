import { ApiError } from '#/lib/api/error'

export type AuthErrorProps = {
  error: unknown
}

const messageOf = (error: unknown): string | null => {
  if (!error) return null
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}

export const AuthError = ({ error }: AuthErrorProps) => {
  const message = messageOf(error)
  if (!message) return null
  return (
    <div role="alert" className="auth-error">
      {message}
    </div>
  )
}
