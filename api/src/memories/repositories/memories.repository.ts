import { Injectable } from '@nestjs/common';
import { and, desc, eq, lt, or, sql } from 'drizzle-orm';
import { BaseRepository } from '../../database/base-repository';
import { TransactionManager } from '../../database/transaction-manager';
import { memories, users, usersProfiles } from '../../database/schema';

export type MemoryRow = {
  id: string;
  podId: string;
  userId: string;
  title: string;
  description: string | null;
  location: string | null;
  eventDate: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type MemoryWithAuthorRow = MemoryRow & {
  authorId: string;
  authorName: string;
};

@Injectable()
export class MemoriesRepository extends BaseRepository {
  constructor(tm: TransactionManager) {
    super(tm);
  }

  async findById(id: string): Promise<MemoryRow | null> {
    const [row] = await this.db()
      .select({
        id: memories.id,
        podId: memories.podId,
        userId: memories.userId,
        title: memories.title,
        description: memories.description,
        location: memories.location,
        eventDate: memories.eventDate,
        createdAt: memories.createdAt,
        updatedAt: memories.updatedAt,
      })
      .from(memories)
      .where(eq(memories.id, id))
      .limit(1);
    return row ?? null;
  }

  async list(
    podId: string,
    opts: { cursor?: string | null; limit: number },
  ): Promise<{ rows: MemoryWithAuthorRow[]; nextCursor: string | null }> {
    const limit = opts.limit;
    const conditions = [eq(memories.podId, podId)];

    if (opts.cursor) {
      const decoded = Buffer.from(opts.cursor, 'base64').toString('utf8');
      const [dateStr, memoryId] = decoded.split('|');
      if (dateStr && memoryId) {
        conditions.push(
          or(
            lt(memories.eventDate, dateStr),
            and(eq(memories.eventDate, dateStr), lt(memories.id, memoryId)),
          )!,
        );
      }
    }

    const rows = await this.db()
      .select({
        id: memories.id,
        podId: memories.podId,
        userId: memories.userId,
        title: memories.title,
        description: memories.description,
        location: memories.location,
        eventDate: memories.eventDate,
        createdAt: memories.createdAt,
        updatedAt: memories.updatedAt,
        authorId: users.id,
        firstName: usersProfiles.firstName,
        lastName: usersProfiles.lastName,
        email: users.email,
      })
      .from(memories)
      .innerJoin(users, eq(users.id, memories.userId))
      .leftJoin(usersProfiles, eq(usersProfiles.userId, users.id))
      .where(and(...conditions))
      .orderBy(desc(memories.eventDate), desc(memories.id))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;

    let nextCursor: string | null = null;
    if (hasMore && items.length > 0) {
      const last = items[items.length - 1];
      nextCursor = Buffer.from(`${last.eventDate}|${last.id}`).toString(
        'base64',
      );
    }

    return {
      rows: items.map((r) => ({
        id: r.id,
        podId: r.podId,
        userId: r.userId,
        title: r.title,
        description: r.description,
        location: r.location,
        eventDate: r.eventDate,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        authorId: r.authorId,
        authorName:
          r.firstName || r.lastName
            ? `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim()
            : r.email,
      })),
      nextCursor,
    };
  }

  async create(input: {
    podId: string;
    userId: string;
    title: string;
    eventDate: string;
    description?: string;
    location?: string;
  }): Promise<MemoryWithAuthorRow> {
    const [inserted] = await this.db()
      .insert(memories)
      .values({
        podId: input.podId,
        userId: input.userId,
        title: input.title,
        eventDate: input.eventDate,
        description: input.description ?? null,
        location: input.location ?? null,
      })
      .returning({
        id: memories.id,
        podId: memories.podId,
        userId: memories.userId,
        title: memories.title,
        description: memories.description,
        location: memories.location,
        eventDate: memories.eventDate,
        createdAt: memories.createdAt,
        updatedAt: memories.updatedAt,
      });

    const [userRow] = await this.db()
      .select({
        id: users.id,
        email: users.email,
        firstName: usersProfiles.firstName,
        lastName: usersProfiles.lastName,
      })
      .from(users)
      .leftJoin(usersProfiles, eq(usersProfiles.userId, users.id))
      .where(eq(users.id, input.userId))
      .limit(1);

    const authorName =
      userRow.firstName || userRow.lastName
        ? `${userRow.firstName ?? ''} ${userRow.lastName ?? ''}`.trim()
        : userRow.email;

    return {
      ...inserted,
      authorId: userRow.id,
      authorName,
    };
  }

  async update(
    id: string,
    input: Partial<{
      title: string;
      eventDate: string;
      description: string;
      location: string;
    }>,
  ): Promise<MemoryRow | null> {
    const [row] = await this.db()
      .update(memories)
      .set(input)
      .where(eq(memories.id, id))
      .returning({
        id: memories.id,
        podId: memories.podId,
        userId: memories.userId,
        title: memories.title,
        description: memories.description,
        location: memories.location,
        eventDate: memories.eventDate,
        createdAt: memories.createdAt,
        updatedAt: memories.updatedAt,
      });
    return row ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const rows = await this.db()
      .delete(memories)
      .where(eq(memories.id, id))
      .returning({ id: memories.id });
    return rows.length > 0;
  }
}
