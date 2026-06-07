import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../../common/dto/response.dto';
import { PodSummaryResponse } from './pod-summary.response';

export class PodSummaryEnvelope {
  @ApiProperty({ type: PodSummaryResponse })
  data!: PodSummaryResponse;

  @ApiProperty({ example: 'OK' })
  message!: string;

  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  status!: ResponseStatus;
}
