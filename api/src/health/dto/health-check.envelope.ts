import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../common/dto/response.dto';
import { HealthCheckResponse } from './health-check.response';

export class HealthCheckEnvelope {
  @ApiProperty({ type: HealthCheckResponse })
  data!: HealthCheckResponse;

  @ApiProperty({ example: 'OK' })
  message!: string;

  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  status!: ResponseStatus;
}
