import { ApiProperty } from '@nestjs/swagger';

export class MeResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'jane@example.com' })
  email!: string;

  @ApiProperty({ example: 'member' })
  role!: string;

  @ApiProperty({ example: 'active' })
  status!: string;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  emailVerifiedAt!: Date | null;

  @ApiProperty({ type: String, nullable: true, example: 'Jane' })
  firstName!: string | null;

  @ApiProperty({ type: String, nullable: true, example: 'Doe' })
  lastName!: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'https://example.com/avatar.jpg',
  })
  avatarUrl!: string | null;
}
