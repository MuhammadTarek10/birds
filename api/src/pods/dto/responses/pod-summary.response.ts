import { ApiProperty } from '@nestjs/swagger';

export class PodSummaryResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Our family' })
  name!: string;

  @ApiProperty({ example: 'A7K3D9F2M5' })
  code!: string;

  @ApiProperty({ example: 'admin' })
  role!: string;

  @ApiProperty({ example: 1 })
  memberCount!: number;

  @ApiProperty({ type: String, format: 'date-time' })
  joinedAt!: Date;
}
