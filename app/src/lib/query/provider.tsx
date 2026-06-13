import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { sessionEnded } from '#/lib/api/unauthenticated'
import { queryClient } from './client'

export type QueryProviderProps = {
  children: ReactNode
  onSessionEnded?: () => void
}

export const QueryProvider = ({
  children,
  onSessionEnded,
}: QueryProviderProps) => {
  useEffect(() => {
    return sessionEnded.on(() => {
      queryClient.setQueryData(['me'], null)
      onSessionEnded?.()
    })
  }, [onSessionEnded])

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
