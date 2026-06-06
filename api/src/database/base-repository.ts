import type { Database } from './database.module';
import { TransactionManager } from './transaction-manager';

export abstract class BaseRepository {
  constructor(protected readonly tm: TransactionManager) {}

  protected db(): Database {
    return this.tm.current();
  }
}
