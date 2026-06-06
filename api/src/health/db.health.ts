import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';

@Injectable()
export class DbHealthIndicator {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async pingCheck(key: string) {
    const indicator = this.healthIndicatorService.check(key);

    try {
      await this.pool.query('SELECT 1');
      return indicator.up();
    } catch (err) {
      return indicator.down({
        message: (err as Error).message,
      });
    }
  }
}
