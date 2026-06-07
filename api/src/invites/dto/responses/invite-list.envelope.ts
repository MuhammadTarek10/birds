import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../../common/dto/response.dto';
import { InviteListResponse } from './invite-list.response';

export class InviteListEnvelope {
  @ApiProperty({ type: InviteListResponse })
  data!: InviteListResponse;

  @ApiProperty({ example: 'OK' })
  message!: string;

  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  status!: ResponseStatus;
}
