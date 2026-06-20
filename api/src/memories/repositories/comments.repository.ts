import { Injectable } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { BaseRepository } from '../../database/base-repository';
import { TransactionManager } from '../../database/transaction-manager';
import { comments, users, usersProfiles } from '../../database/schema';

export type CommentRow = {
  id: string;
  memoryId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type CommentWithAuthorRow = CommentRow & {
  authorId: string;
  authorName: string;
};

@Injectable()
export class CommentsRepository extends BaseRepository {
  constructor(tm: TransactionManager) {
    super(tm);
  }

  async findById(id: string): Promise<CommentRow | null> {
    const [row] = await this.db()
      .select({
        id: comments.id,
        memoryId: comments.memoryId,
        userId: comments.userId,
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
      })
      .from(comments)
      .where(eq(comments.id, id))
      .limit(1);
    return row ?? null;
  }

  async listForMemory(memoryId: string): Promise<CommentWithAuthorRow[]> {
    const rows = await this.db()
      .select({
        id: comments.id,
        memoryId: comments.memoryId,
        userId: comments.userId,
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        authorId: users.id,
        email: users.email,
        firstName: usersProfiles.firstName,
        lastName: usersProfiles.lastName,
      })
      .from(comments)
      .innerJoin(users, eq(users.id, comments.userId))
      .leftJoin(usersProfiles, eq(usersProfiles.userId, users.id))
      .where(eq(comments.memoryId, memoryId))
      .orderBy(asc(comments.createdAt));

    return rows.map((r) => ({
      id: r.id,
      memoryId: r.memoryId,
      userId: r.userId,
      content: r.content,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      authorId: r.authorId,
      authorName:
        r.firstName || r.lastName
          ? `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim()
          : r.email,
    }));
  }

  async findByIdWithAuthor(id: string): Promise<CommentWithAuthorRow | null> {
    const [row] = await this.db()
      .select({
        id: comments.id,
        memoryId: comments.memoryId,
        userId: comments.userId,
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        authorId: users.id,
        email: users.email,
        firstName: usersProfiles.firstName,
        lastName: usersProfiles.lastName,
      })
      .from(comments)
      .innerJoin(users, eq(users.id, comments.userId))
      .leftJoin(usersProfiles, eq(usersProfiles.userId, users.id))
      .where(eq(comments.id, id))
      .limit(1);

    if (!row) return null;

    return {
      id: row.id,
      memoryId: row.memoryId,
      userId: row.userId,
      content: row.content,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      authorId: row.authorId,
      authorName:
        row.firstName || row.lastName
          ? `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim()
          : row.email,
    };
  }

  async create(input: {
    memoryId: string;
    userId: string;
    content: string;
  }): Promise<CommentWithAuthorRow> {
    const [inserted] = await this.db()
      .insert(comments)
      .values({
        memoryId: input.memoryId,
        userId: input.userId,
        content: input.content,
      })
      .returning({ id: comments.id });

    const result = await this.findByIdWithAuthor(inserted.id);
    return result!;
  }

  async update(id: string, content: string): Promise<CommentWithAuthorRow | null> {
    const [updated] = await this.db()
      .update(comments)
      .set({ content })
      .where(eq(comments.id, id))
      .returning({ id: comments.id });

    if (!updated) return null;

    return this.findByIdWithAuthor(updated.id);
  }

  async delete(id: string): Promise<boolean> {
    const rows = await this.db()
      .delete(comments)
      .where(eq(comments.id, id))
      .returning({ id: comments.id });
    return rows.length > 0;
  }
}
