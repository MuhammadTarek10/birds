export const inviteKeys = {
  preview: (token: string) => ['invite-preview', token] as const,
  podInvites: (podId: string) => ['pods', podId, 'invites'] as const,
}
