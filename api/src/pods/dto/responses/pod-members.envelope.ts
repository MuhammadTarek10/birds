import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../../common/dto/response.dto';
import { PodMembersResponse } from './pod-members.response';

export class PodMembersEnvelope {
  @ApiProperty({ type: PodMembersResponse })
  data!: PodMembersResponse;

  @ApiProperty({ example: 'OK' })
  message!: string;

  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  status!: ResponseStatus;
}
