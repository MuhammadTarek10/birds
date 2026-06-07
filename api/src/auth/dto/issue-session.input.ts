import type { SessionContext } from '../types';

export class IssueSessionInput {
  userId!: string;
  authId!: string;
  role!: string;
  email!: string;
  ctx?: SessionContext;
}

export class IssueSessionResult {
  accessToken!: string;
  refreshToken!: string;
  sessionId!: string;
  accessTtlMs!: number;
  refreshTtlMs!: number;
}
