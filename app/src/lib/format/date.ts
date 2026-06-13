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
