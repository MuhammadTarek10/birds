import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../../common/dto/response.dto';
import { AuthSessionResponse } from './auth-session.response';

export class AuthSessionEnvelope {
  @ApiProperty({ type: AuthSessionResponse })
  data!: AuthSessionResponse;

  @ApiProperty({ example: 'Logged in' })
  message!: string;

  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  status!: ResponseStatus;
}
