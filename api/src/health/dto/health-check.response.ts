import { ApiProperty } from '@nestjs/swagger';

class HealthIndicatorStatus {
  @ApiProperty({ enum: ['up', 'down'], example: 'up' })
  status!: 'up' | 'down';
}

export class HealthCheckResponse {
  @ApiProperty({ enum: ['ok', 'error', 'shutting_down'], example: 'ok' })
  status!: 'ok' | 'error' | 'shutting_down';

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      $ref: '#/components/schemas/HealthIndicatorStatus',
    },
    example: { db: { status: 'up' } },
  })
  info?: Record<string, HealthIndicatorStatus>;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      $ref: '#/components/schemas/HealthIndicatorStatus',
    },
    example: {},
  })
  error?: Record<string, HealthIndicatorStatus>;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      $ref: '#/components/schemas/HealthIndicatorStatus',
    },
    example: { db: { status: 'up' } },
  })
  details!: Record<string, HealthIndicatorStatus>;
}
