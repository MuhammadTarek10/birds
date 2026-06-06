import { Injectable } from '@nestjs/common';
import { eq, type InferInsertModel } from 'drizzle-orm';
import { BaseRepository } from '../../database/base-repository';
import { users, usersProfiles } from '../../database/schema';
import { TransactionManager } from '../../database/transaction-manager';

export type UserRow = {
  id: string;
  email: string;
  role: string;
};

export type MeRow = {
  id: string;
  email: string;
  role: string;
  status: string;
  emailVerifiedAt: Date | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
};

@Injectable()
export class UsersRepository extends BaseRepository {
  constructor(tm: TransactionManager) {
    super(tm);
  }

  async findByEmail(email: string): Promise<UserRow | null> {
    const [row] = await this.db()
      .select({ id: users.id, email: users.email, role: users.role })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return row ?? null;
  }

  async insert(values: InferInsertModel<typeof users>): Promise<UserRow> {
    const [row] = await this.db()
      .insert(users)
      .values(values)
      .returning({ id: users.id, email: users.email, role: users.role });
    return row;
  }

  async findMeById(userId: string): Promise<MeRow | null> {
    const [row] = await this.db()
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        status: users.status,
        emailVerifiedAt: users.emailVerifiedAt,
        firstName: usersProfiles.firstName,
        lastName: usersProfiles.lastName,
        avatarUrl: usersProfiles.avatarUrl,
      })
      .from(users)
      .leftJoin(usersProfiles, eq(usersProfiles.userId, users.id))
      .where(eq(users.id, userId))
      .limit(1);
    return row ?? null;
  }
}
