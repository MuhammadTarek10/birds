import { ApiProperty } from '@nestjs/swagger';

export class InviteResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'kU2qK7sM3pS9dR1nT4vW6xY8' })
  token!: string;

  @ApiProperty({
    example: 'https://app.example.com/invite/kU2qK7sM3pS9dR1nT4vW6xY8',
  })
  inviteUrl!: string;

  @ApiProperty({ format: 'uuid' })
  podId!: string;

  @ApiProperty({ type: String, nullable: true, format: 'email' })
  email!: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  expiresAt!: Date;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  redeemedAt!: Date | null;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  revokedAt!: Date | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;
}
