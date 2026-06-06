import { Injectable } from '@nestjs/common';
import { type InferInsertModel } from 'drizzle-orm';
import { BaseRepository } from '../../database/base-repository';
import { usersProfiles } from '../../database/schema';
import { TransactionManager } from '../../database/transaction-manager';

@Injectable()
export class UserProfilesRepository extends BaseRepository {
  constructor(tm: TransactionManager) {
    super(tm);
  }

  async insert(values: InferInsertModel<typeof usersProfiles>): Promise<void> {
    await this.db().insert(usersProfiles).values(values);
  }
}
