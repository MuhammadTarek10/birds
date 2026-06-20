import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MemoryAuthorResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Jane Doe' })
  name!: string;
}

export class MemoryResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  podId!: string;

  @ApiProperty({ format: 'uuid' })
  userId!: string;

  @ApiProperty({ example: 'Beach vacation' })
  title!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiPropertyOptional({ nullable: true })
  location!: string | null;

  @ApiProperty({ example: '2026-06-20' })
  eventDate!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  updatedAt!: Date | null;

  @ApiProperty({ type: MemoryAuthorResponse })
  author!: MemoryAuthorResponse;
}
