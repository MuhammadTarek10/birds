import { useParams } from '@tanstack/react-router'

export const useMemoryIdFromUrl = (): string | undefined =>
  useParams({ strict: false }).memoryId
