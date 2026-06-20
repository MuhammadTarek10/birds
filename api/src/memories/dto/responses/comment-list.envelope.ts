import { ApiProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../../common/dto/response.dto';
import { CommentResponse } from './comment.response';

export class CommentListResponse {
  @ApiProperty({ type: [CommentResponse] })
  comments!: CommentResponse[];
}

export class CommentListEnvelope {
  @ApiProperty({ type: CommentListResponse })
  data!: CommentListResponse;

  @ApiProperty({ example: 'Comments retrieved' })
  message!: string;

  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  status!: ResponseStatus;
}

export class CommentEnvelope {
  @ApiProperty({ type: CommentResponse })
  data!: CommentResponse;

  @ApiProperty({ example: 'Comment created' })
  message!: string;

  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  status!: ResponseStatus;
}
