import { ApiProperty } from '@nestjs/swagger';
import { UserSummaryResponse } from './user-summary.response';

export class AuthSessionResponse {
  @ApiProperty({ type: UserSummaryResponse })
  user!: UserSummaryResponse;

  @ApiProperty({
    description: 'JWT to send as `Authorization: Bearer <token>` from non-cookie clients',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'JWT to exchange at /auth/refresh from non-cookie clients',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken!: string;

  @ApiProperty({ example: 900000, description: 'Access token TTL in milliseconds' })
  accessTtlMs!: number;

  @ApiProperty({ example: 2592000000, description: 'Refresh token TTL in milliseconds' })
  refreshTtlMs!: number;
}
