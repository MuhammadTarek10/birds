export type NameInput = {
  firstName?: string | null
  lastName?: string | null
  email: string
}

export const displayName = (u: NameInput): string => {
  const first = u.firstName?.trim()
  const last = u.lastName?.trim()
  if (first || last) return `${first ?? ''}${first && last ? ' ' : ''}${last ?? ''}`
  return u.email
}

export const initials = (u: NameInput): string => {
  const first = u.firstName?.trim()[0]
  const last = u.lastName?.trim()[0]
  if (first || last) return `${first ?? ''}${last ?? ''}`.toUpperCase()
  return u.email.slice(0, 2).toUpperCase()
}

export const hasName = (u: NameInput): boolean =>
  Boolean(u.firstName?.trim() || u.lastName?.trim())
