import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { queryClient } from './client'

export const QueryProvider = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)
