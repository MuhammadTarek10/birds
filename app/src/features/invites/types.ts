export type InvitePreview = {
  podName: string
  inviterEmail?: string
  email?: string | null
  expiresAt: string
}

export type Invite = {
  id: string
  token: string
  inviteUrl: string
  email: string | null
  expiresAt: string
  redeemedAt: string | null
  redeemedBy: string | null
  revokedAt: string | null
  createdAt: string
  createdBy: string
}

export type RedeemResult = {
  podId: string
  podName: string
}
