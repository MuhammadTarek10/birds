import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ format: 'email', example: 'jane@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Pa55w0rd!' })
  @IsString()
  @MinLength(1)
  password!: string;
}
