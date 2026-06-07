import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ format: 'email', example: 'jane@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, maxLength: 128, example: 'Pa55w0rd!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @ApiPropertyOptional({ maxLength: 120, example: 'Jane' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  firstName?: string;

  @ApiPropertyOptional({ maxLength: 120, example: 'Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  lastName?: string;

  @ApiPropertyOptional({
    minLength: 16,
    maxLength: 64,
    description:
      "Optional invite token; when present, joins the inviter's pod instead of auto-creating one.",
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  inviteToken?: string;
}
