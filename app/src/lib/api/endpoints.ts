export const endpoints = {
  auth: {
    me: '/auth/me',
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    google: '/auth/google',
  },
  pods: {
    list: '/pods',
    detail: (id: string) => `/pods/${id}`,
    members: (id: string) => `/pods/${id}/members`,
    member: (id: string, uid: string) => `/pods/${id}/members/${uid}`,
    invites: (id: string) => `/pods/${id}/invites`,
    invite: (id: string, inviteId: string) => `/pods/${id}/invites/${inviteId}`,
  },
  invites: {
    preview: (token: string) => `/invites/${token}`,
    redeem: '/invites/redeem',
  },
  memories: {
    list: (podId: string) => `/pods/${podId}/memories`,
    detail: (id: string) => `/memories/${id}`,
    create: (podId: string) => `/pods/${podId}/memories`,
    comments: (memoryId: string) => `/memories/${memoryId}/comments`,
    comment: (id: string) => `/comments/${id}`,
  },
} as const
