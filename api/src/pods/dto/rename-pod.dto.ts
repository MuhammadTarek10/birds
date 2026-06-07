import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RenamePodDto {
  @ApiProperty({ minLength: 1, maxLength: 120, example: 'Smith family' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;
}
