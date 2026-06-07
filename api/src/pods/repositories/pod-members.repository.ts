import { Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { BaseRepository } from '../../database/base-repository';
import { podMembers, pods, users, usersProfiles } from '../../database/schema';
import { TransactionManager } from '../../database/transaction-manager';

export type MembershipRow = {
  id: string;
  podId: string;
  userId: string;
  role: string;
  joinedAt: Date;
};

export type PodForUserRow = {
  id: string;
  name: string;
  code: string;
  role: string;
  joinedAt: Date;
  memberCount: number;
};

export type MemberWithUserRow = {
  id: string;
  userId: string;
  role: string;
  joinedAt: Date;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
};

@Injectable()
export class PodMembersRepository extends BaseRepository {
  constructor(tm: TransactionManager) {
    super(tm);
  }

  async findByPodAndUser(
    podId: string,
    userId: string,
  ): Promise<MembershipRow | null> {
    const [row] = await this.db()
      .select({
        id: podMembers.id,
        podId: podMembers.podId,
        userId: podMembers.userId,
        role: podMembers.role,
        joinedAt: podMembers.joinedAt,
      })
      .from(podMembers)
      .where(and(eq(podMembers.podId, podId), eq(podMembers.userId, userId)))
      .limit(1);
    return row ?? null;
  }

  async listForUser(userId: string): Promise<PodForUserRow[]> {
    const countSubquery = this.db()
      .select({
        podId: podMembers.podId,
        memberCount: sql<number>`cast(count(*) as int)`.as('member_count'),
      })
      .from(podMembers)
      .groupBy(podMembers.podId)
      .as('counts');

    return this.db()
      .select({
        id: pods.id,
        name: pods.name,
        code: pods.code,
        role: podMembers.role,
        joinedAt: podMembers.joinedAt,
        memberCount: countSubquery.memberCount,
      })
      .from(podMembers)
      .innerJoin(pods, eq(pods.id, podMembers.podId))
      .innerJoin(countSubquery, eq(countSubquery.podId, podMembers.podId))
      .where(eq(podMembers.userId, userId))
      .orderBy(podMembers.joinedAt);
  }

  async countMembers(podId: string): Promise<number> {
    const [row] = await this.db()
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(podMembers)
      .where(eq(podMembers.podId, podId));
    return row?.count ?? 0;
  }

  async countAdmins(podId: string): Promise<number> {
    const [row] = await this.db()
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(podMembers)
      .where(and(eq(podMembers.podId, podId), eq(podMembers.role, 'admin')));
    return row?.count ?? 0;
  }

  async findMemberWithUser(
    podId: string,
    userId: string,
  ): Promise<MemberWithUserRow | null> {
    const [row] = await this.db()
      .select({
        id: podMembers.id,
        userId: podMembers.userId,
        role: podMembers.role,
        joinedAt: podMembers.joinedAt,
        email: users.email,
        firstName: usersProfiles.firstName,
        lastName: usersProfiles.lastName,
        avatarUrl: usersProfiles.avatarUrl,
      })
      .from(podMembers)
      .innerJoin(users, eq(users.id, podMembers.userId))
      .leftJoin(usersProfiles, eq(usersProfiles.userId, users.id))
      .where(and(eq(podMembers.podId, podId), eq(podMembers.userId, userId)))
      .limit(1);
    return row ?? null;
  }

  async listMembers(podId: string): Promise<MemberWithUserRow[]> {
    return this.db()
      .select({
        id: podMembers.id,
        userId: podMembers.userId,
        role: podMembers.role,
        joinedAt: podMembers.joinedAt,
        email: users.email,
        firstName: usersProfiles.firstName,
        lastName: usersProfiles.lastName,
        avatarUrl: usersProfiles.avatarUrl,
      })
      .from(podMembers)
      .innerJoin(users, eq(users.id, podMembers.userId))
      .leftJoin(usersProfiles, eq(usersProfiles.userId, users.id))
      .where(eq(podMembers.podId, podId))
      .orderBy(podMembers.joinedAt);
  }

  async insert(input: {
    podId: string;
    userId: string;
    role: string;
  }): Promise<MembershipRow> {
    const [row] = await this.db().insert(podMembers).values(input).returning({
      id: podMembers.id,
      podId: podMembers.podId,
      userId: podMembers.userId,
      role: podMembers.role,
      joinedAt: podMembers.joinedAt,
    });
    return row;
  }

  async updateRole(
    podId: string,
    userId: string,
    role: string,
  ): Promise<MembershipRow | null> {
    const [row] = await this.db()
      .update(podMembers)
      .set({ role })
      .where(and(eq(podMembers.podId, podId), eq(podMembers.userId, userId)))
      .returning({
        id: podMembers.id,
        podId: podMembers.podId,
        userId: podMembers.userId,
        role: podMembers.role,
        joinedAt: podMembers.joinedAt,
      });
    return row ?? null;
  }

  async remove(podId: string, userId: string): Promise<boolean> {
    const rows = await this.db()
      .delete(podMembers)
      .where(and(eq(podMembers.podId, podId), eq(podMembers.userId, userId)))
      .returning({ id: podMembers.id });
    return rows.length > 0;
  }
}
