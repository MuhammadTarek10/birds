import { Injectable } from '@nestjs/common';
import { TransactionManager } from '../../database/transaction-manager';
import { generatePodCode } from '../utils/code';
import { PodMembersRepository } from './pod-members.repository';
import { PodsRepository, type PodRow } from './pods.repository';

const MAX_CODE_RETRIES = 3;
const PG_UNIQUE_VIOLATION = '23505';

export type CreatedPodRow = PodRow & {
  membershipId: string;
  role: string;
  joinedAt: Date;
};

@Injectable()
export class PodAccountsRepository {
  constructor(
    private readonly tm: TransactionManager,
    private readonly pods: PodsRepository,
    private readonly members: PodMembersRepository,
  ) {}

  createWithCreator(input: {
    name: string;
    creatorUserId: string;
  }): Promise<CreatedPodRow> {
    return this.tm.run(async () => {
      const pod = await this.withFreshCode((code) =>
        this.pods.insert({ name: input.name, code }),
      );
      const member = await this.members.insert({
        podId: pod.id,
        userId: input.creatorUserId,
        role: 'admin',
      });
      return {
        ...pod,
        membershipId: member.id,
        role: member.role,
        joinedAt: member.joinedAt,
      };
    });
  }

  private async withFreshCode<T>(fn: (code: string) => Promise<T>): Promise<T> {
    let lastErr: Error = new Error('Failed to generate a unique pod code');
    for (let i = 0; i < MAX_CODE_RETRIES; i++) {
      try {
        return await fn(generatePodCode());
      } catch (err) {
        lastErr = err instanceof Error ? err : new Error(String(err));
        if (!isUniqueViolation(err)) throw err;
      }
    }
    throw lastErr;
  }
}

const isUniqueViolation = (err: unknown): boolean =>
  typeof err === 'object' &&
  err !== null &&
  (err as { code?: string }).code === PG_UNIQUE_VIOLATION;
