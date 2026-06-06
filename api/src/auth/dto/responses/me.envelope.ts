import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../../common/dto/response.dto';
import { MeResponse } from './me.response';

export class MeEnvelope {
  @ApiProperty({ type: MeResponse, nullable: true })
  data!: MeResponse | null;

  @ApiProperty({ example: 'OK' })
  message!: string;

  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  status!: ResponseStatus;
}
