import type { Database } from './tokens';
import { TransactionManager } from './transaction-manager';

export abstract class BaseRepository {
  constructor(protected readonly tm: TransactionManager) {}

  protected db(): Database {
    return this.tm.current();
  }
}
