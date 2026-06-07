import { Injectable } from '@nestjs/common';
import { and, desc, eq, gt, isNull } from 'drizzle-orm';
import { BaseRepository } from '../../database/base-repository';
import { podInvites } from '../../database/schema';
import { TransactionManager } from '../../database/transaction-manager';

export type InviteRow = {
  id: string;
  token: string;
  podId: string;
  createdBy: string;
  email: string | null;
  expiresAt: Date;
  redeemedAt: Date | null;
  redeemedBy: string | null;
  revokedAt: Date | null;
  createdAt: Date;
};

const projection = {
  id: podInvites.id,
  token: podInvites.token,
  podId: podInvites.podId,
  createdBy: podInvites.createdBy,
  email: podInvites.email,
  expiresAt: podInvites.expiresAt,
  redeemedAt: podInvites.redeemedAt,
  redeemedBy: podInvites.redeemedBy,
  revokedAt: podInvites.revokedAt,
  createdAt: podInvites.createdAt,
};

@Injectable()
export class InvitesRepository extends BaseRepository {
  constructor(tm: TransactionManager) {
    super(tm);
  }

  async findByToken(token: string): Promise<InviteRow | null> {
    const [row] = await this.db()
      .select(projection)
      .from(podInvites)
      .where(eq(podInvites.token, token))
      .limit(1);
    return row ?? null;
  }

  async findActiveByToken(
    token: string,
    now: Date = new Date(),
  ): Promise<InviteRow | null> {
    const [row] = await this.db()
      .select(projection)
      .from(podInvites)
      .where(
        and(
          eq(podInvites.token, token),
          isNull(podInvites.redeemedAt),
          isNull(podInvites.revokedAt),
          gt(podInvites.expiresAt, now),
        ),
      )
      .limit(1);
    return row ?? null;
  }

  async findById(id: string): Promise<InviteRow | null> {
    const [row] = await this.db()
      .select(projection)
      .from(podInvites)
      .where(eq(podInvites.id, id))
      .limit(1);
    return row ?? null;
  }

  listForPod(podId: string): Promise<InviteRow[]> {
    return this.db()
      .select(projection)
      .from(podInvites)
      .where(eq(podInvites.podId, podId))
      .orderBy(desc(podInvites.createdAt));
  }

  async insert(input: {
    token: string;
    podId: string;
    createdBy: string;
    email: string | null;
    expiresAt: Date;
  }): Promise<InviteRow> {
    const [row] = await this.db()
      .insert(podInvites)
      .values(input)
      .returning(projection);
    return row;
  }

  async markRedeemed(id: string, userId: string): Promise<boolean> {
    const rows = await this.db()
      .update(podInvites)
      .set({ redeemedAt: new Date(), redeemedBy: userId })
      .where(
        and(
          eq(podInvites.id, id),
          isNull(podInvites.redeemedAt),
          isNull(podInvites.revokedAt),
        ),
      )
      .returning({ id: podInvites.id });
    return rows.length > 0;
  }

  async revoke(id: string): Promise<boolean> {
    const rows = await this.db()
      .update(podInvites)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(podInvites.id, id),
          isNull(podInvites.redeemedAt),
          isNull(podInvites.revokedAt),
        ),
      )
      .returning({ id: podInvites.id });
    return rows.length > 0;
  }
}
