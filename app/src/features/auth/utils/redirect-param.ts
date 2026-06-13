export const readRedirect = (search: unknown): string => {
  if (search && typeof search === 'object' && 'redirect' in search) {
    const raw = (search as { redirect?: unknown }).redirect
    if (typeof raw === 'string' && raw.startsWith('/') && !raw.startsWith('//')) {
      return raw
    }
  }
  return '/'
}
