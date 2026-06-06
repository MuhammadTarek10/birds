import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { BaseRepository } from '../../database/base-repository';
import { auth, users } from '../../database/schema';
import { TransactionManager } from '../../database/transaction-manager';

export type LocalCredentialRow = {
  authId: string;
  userId: string;
  email: string;
  role: string;
  passwordHash: string | null;
  failedAttempts: number | null;
  lockedUntil: Date | null;
};

export type AuthedUserRow = {
  authId: string;
  userId: string;
  email: string;
  role: string;
};

@Injectable()
export class AuthCredentialsRepository extends BaseRepository {
  constructor(tm: TransactionManager) {
    super(tm);
  }

  async findLocalByEmail(email: string): Promise<LocalCredentialRow | null> {
    const [row] = await this.db()
      .select({
        authId: auth.id,
        userId: users.id,
        email: users.email,
        role: users.role,
        passwordHash: auth.passwordHash,
        failedAttempts: auth.failedAttempts,
        lockedUntil: auth.lockedUntil,
      })
      .from(auth)
      .innerJoin(users, eq(users.id, auth.userId))
      .where(and(eq(users.email, email), eq(auth.provider, 'local')))
      .limit(1);
    return row ?? null;
  }

  async findByProviderUserId(
    provider: string,
    providerUserId: string,
  ): Promise<AuthedUserRow | null> {
    const [row] = await this.db()
      .select({
        authId: auth.id,
        userId: users.id,
        email: users.email,
        role: users.role,
      })
      .from(auth)
      .innerJoin(users, eq(users.id, auth.userId))
      .where(
        and(
          eq(auth.provider, provider),
          eq(auth.providerUserId, providerUserId),
        ),
      )
      .limit(1);
    return row ?? null;
  }

  async findUserBundleById(authId: string): Promise<AuthedUserRow | null> {
    const [row] = await this.db()
      .select({
        authId: auth.id,
        userId: users.id,
        email: users.email,
        role: users.role,
      })
      .from(auth)
      .innerJoin(users, eq(users.id, auth.userId))
      .where(eq(auth.id, authId))
      .limit(1);
    return row ?? null;
  }

  async insertLocal(input: {
    userId: string;
    passwordHash: string;
  }): Promise<string> {
    const [row] = await this.db()
      .insert(auth)
      .values({
        userId: input.userId,
        provider: 'local',
        isPrimary: true,
        passwordHash: input.passwordHash,
      })
      .returning({ id: auth.id });
    return row.id;
  }

  async insertGoogle(input: {
    userId: string;
    providerUserId: string;
    isPrimary: boolean;
  }): Promise<string> {
    const [row] = await this.db()
      .insert(auth)
      .values({
        userId: input.userId,
        provider: 'google',
        providerUserId: input.providerUserId,
        isPrimary: input.isPrimary,
      })
      .returning({ id: auth.id });
    return row.id;
  }

  async recordFailedAttempt(
    authId: string,
    count: number,
    lockedUntil: Date | null,
  ): Promise<void> {
    await this.db()
      .update(auth)
      .set({ failedAttempts: count, lockedUntil })
      .where(eq(auth.id, authId));
  }

  async resetFailedAttempts(authId: string): Promise<void> {
    await this.db()
      .update(auth)
      .set({ failedAttempts: 0, lockedUntil: null, lastUsedAt: new Date() })
      .where(eq(auth.id, authId));
  }
}
