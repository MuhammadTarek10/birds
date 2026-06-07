import { ApiProperty } from '@nestjs/swagger';
import { InviteResponse } from './invite.response';

export class InviteListResponse {
  @ApiProperty({ type: [InviteResponse] })
  invites!: InviteResponse[];
}
