export const podKeys = {
  all: ['pods'] as const,
  detail: (id: string) => ['pods', id] as const,
  members: (id: string) => ['pods', id, 'members'] as const,
  invites: (id: string) => ['pods', id, 'invites'] as const,
}
