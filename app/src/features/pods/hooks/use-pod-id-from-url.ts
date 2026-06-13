import { useParams } from '@tanstack/react-router'

export const usePodIdFromUrl = (): string | undefined =>
  useParams({ strict: false }).podId
