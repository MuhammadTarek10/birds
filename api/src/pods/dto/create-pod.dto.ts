import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePodDto {
  @ApiProperty({ minLength: 1, maxLength: 120, example: 'Our family' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;
}
