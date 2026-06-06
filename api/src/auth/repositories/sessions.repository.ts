import { Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { BaseRepository } from '../../database/base-repository';
import { sessions } from '../../database/schema';
import { TransactionManager } from '../../database/transaction-manager';

export type ActiveSession = {
  authId: string;
  expiresAt: Date;
};

@Injectable()
export class SessionsRepository extends BaseRepository {
  constructor(tm: TransactionManager) {
    super(tm);
  }

  async insertActive(input: {
    authId: string;
    refreshTokenHash: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
  }): Promise<string> {
    const [row] = await this.db()
      .insert(sessions)
      .values(input)
      .returning({ id: sessions.id });
    return row.id;
  }

  async findActive(sessionId: string): Promise<ActiveSession | null> {
    const [row] = await this.db()
      .select({ authId: sessions.authId, expiresAt: sessions.expiresAt })
      .from(sessions)
      .where(and(eq(sessions.id, sessionId), isNull(sessions.revokedAt)))
      .limit(1);
    return row ?? null;
  }

  async revoke(sessionId: string): Promise<void> {
    await this.db()
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(and(eq(sessions.id, sessionId), isNull(sessions.revokedAt)));
  }
}
