import { ApiProperty } from '@nestjs/swagger';

export class UserSummaryResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'jane@example.com' })
  email!: string;

  @ApiProperty({ example: 'member' })
  role!: string;
}
