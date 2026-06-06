import { Inject, Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { DRIZZLE_DB, type Database } from './database.module';

type TxStore = { tx: Database };

@Injectable()
export class TransactionManager {
  private readonly als = new AsyncLocalStorage<TxStore>();

  constructor(@Inject(DRIZZLE_DB) private readonly root: Database) {}

  current(): Database {
    return this.als.getStore()?.tx ?? this.root;
  }

  async run<T>(fn: () => Promise<T>): Promise<T> {
    if (this.als.getStore()) {
      return fn();
    }
    return this.root.transaction((tx) => this.als.run({ tx }, fn));
  }
}
