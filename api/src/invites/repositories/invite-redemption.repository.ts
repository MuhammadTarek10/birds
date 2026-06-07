import { Injectable } from '@nestjs/common';
import { TransactionManager } from '../../database/transaction-manager';
import { PodMembersRepository } from '../../pods/repositories/pod-members.repository';
import { InvitesRepository } from './invites.repository';

@Injectable()
export class InviteRedemptionRepository {
  constructor(
    private readonly tm: TransactionManager,
    private readonly invites: InvitesRepository,
    private readonly members: PodMembersRepository,
  ) {}

  /**
   * Atomically marks an invite redeemed and inserts the new member row.
   * Returns false if the invite was no longer active (raced); caller treats that as Gone.
   */
  redeem(input: {
    inviteId: string;
    podId: string;
    userId: string;
  }): Promise<boolean> {
    return this.tm.run(async () => {
      const marked = await this.invites.markRedeemed(
        input.inviteId,
        input.userId,
      );
      if (!marked) return false;
      await this.members.insert({
        podId: input.podId,
        userId: input.userId,
        role: 'member',
      });
      return true;
    });
  }
}
