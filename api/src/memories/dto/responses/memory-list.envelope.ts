import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../../common/dto/response.dto';
import { MemoryResponse } from './memory.response';

export class MemoryListResponse {
  @ApiProperty({ type: [MemoryResponse] })
  memories!: MemoryResponse[];

  @ApiProperty({ nullable: true, type: String })
  nextCursor!: string | null;
}

export class MemoryListEnvelope {
  @ApiProperty({ type: MemoryListResponse })
  data!: MemoryListResponse;

  @ApiProperty({ example: 'Memories retrieved' })
  message!: string;

  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  status!: ResponseStatus;
}

export class MemoryEnvelope {
  @ApiProperty({ type: MemoryResponse })
  data!: MemoryResponse;

  @ApiProperty({ example: 'Memory created' })
  message!: string;

  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  status!: ResponseStatus;
}
