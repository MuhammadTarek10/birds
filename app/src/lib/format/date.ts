export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export const formatRelativeHours = (iso: string): string => {
  const ms = new Date(iso).getTime() - Date.now()
  if (ms < 0) return 'Past'
  const hours = Math.round(ms / (1000 * 60 * 60))
  if (hours < 24) return `In ${hours}h`
  const days = Math.round(hours / 24)
  return `In ${days}d`
}

export const formatEventDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export const formatCommentTime = (iso: string): string => {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  if (diffHours < 24) {
    const mins = Math.floor(diffMs / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    return `${Math.floor(diffHours)}h ago`
  }
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
