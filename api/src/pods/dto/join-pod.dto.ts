import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class JoinPodDto {
  @ApiProperty({ minLength: 6, maxLength: 32, example: 'A7K3D9F2M5' })
  @IsString()
  @Length(6, 32)
  code!: string;
}
