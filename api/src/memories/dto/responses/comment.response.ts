import { ApiProperty } from '@nestjs/swagger';

export class CommentAuthorResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Jane Doe' })
  name!: string;
}

export class CommentResponse {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  memoryId!: string;

  @ApiProperty({ format: 'uuid' })
  userId!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  updatedAt!: Date | null;

  @ApiProperty({ type: CommentAuthorResponse })
  author!: CommentAuthorResponse;
}
