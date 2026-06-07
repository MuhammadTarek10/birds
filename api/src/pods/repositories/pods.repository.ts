import { Injectable } from '@nestjs/common';
import { eq, type InferInsertModel } from 'drizzle-orm';
import { BaseRepository } from '../../database/base-repository';
import { pods } from '../../database/schema';
import { TransactionManager } from '../../database/transaction-manager';

export type PodRow = {
  id: string;
  name: string;
  code: string;
};

@Injectable()
export class PodsRepository extends BaseRepository {
  constructor(tm: TransactionManager) {
    super(tm);
  }

  async findById(podId: string): Promise<PodRow | null> {
    const [row] = await this.db()
      .select({ id: pods.id, name: pods.name, code: pods.code })
      .from(pods)
      .where(eq(pods.id, podId))
      .limit(1);
    return row ?? null;
  }

  async findByCode(code: string): Promise<PodRow | null> {
    const [row] = await this.db()
      .select({ id: pods.id, name: pods.name, code: pods.code })
      .from(pods)
      .where(eq(pods.code, code))
      .limit(1);
    return row ?? null;
  }

  async insert(values: InferInsertModel<typeof pods>): Promise<PodRow> {
    const [row] = await this.db()
      .insert(pods)
      .values(values)
      .returning({ id: pods.id, name: pods.name, code: pods.code });
    return row;
  }

  async updateName(podId: string, name: string): Promise<PodRow | null> {
    const [row] = await this.db()
      .update(pods)
      .set({ name })
      .where(eq(pods.id, podId))
      .returning({ id: pods.id, name: pods.name, code: pods.code });
    return row ?? null;
  }

  async updateCode(podId: string, code: string): Promise<PodRow | null> {
    const [row] = await this.db()
      .update(pods)
      .set({ code })
      .where(eq(pods.id, podId))
      .returning({ id: pods.id, name: pods.name, code: pods.code });
    return row ?? null;
  }
}
