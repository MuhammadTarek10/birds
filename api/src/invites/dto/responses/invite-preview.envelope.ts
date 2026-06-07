import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../../common/dto/response.dto';
import { InvitePreviewResponse } from './invite-preview.response';

export class InvitePreviewEnvelope {
  @ApiProperty({ type: InvitePreviewResponse })
  data!: InvitePreviewResponse;

  @ApiProperty({ example: 'OK' })
  message!: string;

  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  status!: ResponseStatus;
}
