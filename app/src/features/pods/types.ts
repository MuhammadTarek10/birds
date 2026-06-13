export type PodRole = 'admin' | 'member'

export type PodSummary = {
  id: string
  name: string
  code: string
  role: PodRole
  joinedAt: string
  memberCount: number
}

export type PodMemberUser = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
}

export type PodMember = {
  id: string
  role: PodRole
  joinedAt: string
  user: PodMemberUser
}
