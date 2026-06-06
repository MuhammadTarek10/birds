import { Controller, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { Public } from '../common/decorators/public.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { ErrorResponse } from '../common/dto/error.response';
import { DbHealthIndicator } from './db.health';
import { HealthCheckEnvelope } from './dto/health-check.envelope';

@ApiTags('Health')
@ApiSecurity({})
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: DbHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  @ResponseMessage('Healthy')
  @ApiOperation({ summary: 'Liveness + readiness check (database ping)' })
  @ApiOkResponse({ type: HealthCheckEnvelope })
  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Dependency down',
  })
  check() {
    return this.health.check([() => this.db.pingCheck('db')]);
  }
}
