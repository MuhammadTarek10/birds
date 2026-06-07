import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export const INVITE_TOKEN_REGEX = /^[A-Za-z0-9_-]+$/;

export class RedeemInviteDto {
  @ApiProperty({ minLength: 16, maxLength: 64 })
  @IsString()
  @Length(16, 64)
  @Matches(INVITE_TOKEN_REGEX)
  token!: string;
}
