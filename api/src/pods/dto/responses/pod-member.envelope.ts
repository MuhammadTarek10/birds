import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../../common/dto/response.dto';
import { PodMemberResponse } from './pod-member.response';

export class PodMemberEnvelope {
  @ApiProperty({ type: PodMemberResponse })
  data!: PodMemberResponse;

  @ApiProperty({ example: 'OK' })
  message!: string;

  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  status!: ResponseStatus;
}
