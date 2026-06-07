import { ApiProperty } from '@nestjs/swagger';

export class InvitePreviewResponse {
  @ApiProperty({ example: "Jane's memories" })
  podName!: string;

  @ApiProperty({ type: String, nullable: true, format: 'email' })
  email!: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  expiresAt!: Date;
}
