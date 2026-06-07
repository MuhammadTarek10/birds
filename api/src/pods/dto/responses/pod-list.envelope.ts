import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../../common/dto/response.dto';
import { PodListResponse } from './pod-list.response';

export class PodListEnvelope {
  @ApiProperty({ type: PodListResponse })
  data!: PodListResponse;

  @ApiProperty({ example: 'OK' })
  message!: string;

  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  status!: ResponseStatus;
}
