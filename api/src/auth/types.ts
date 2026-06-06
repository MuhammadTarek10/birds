export type SessionContext = {
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
};

export type AccessPayload = {
  userId: string;
  authId: string;
  sessionId: string;
  role: string;
};

export type RefreshPayload = {
  userId: string;
  sessionId: string;
};

export type CurrentUserPayload = {
  userId: string;
  authId: string;
  sessionId: string;
  role: string;
};
