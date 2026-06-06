import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../../common/dto/response.dto';
import { UserSummaryResponse } from './user-summary.response';

export class UserSummaryEnvelope {
  @ApiProperty({ type: UserSummaryResponse })
  data!: UserSummaryResponse;

  @ApiProperty({ example: 'Logged in' })
  message!: string;

  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  status!: ResponseStatus;
}
