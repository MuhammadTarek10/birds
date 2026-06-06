import { ApiProperty } from '@nestjs/swagger';

export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export class ResponseDto<T> {
  @ApiProperty({ description: 'Response payload' })
  data: T;

  @ApiProperty({ example: 'Operation successful' })
  message: string;

  @ApiProperty({ enum: ResponseStatus, example: ResponseStatus.SUCCESS })
  status: ResponseStatus;

  @ApiProperty({ required: false, example: 'Something went wrong' })
  error?: string;

  constructor(
    data: T,
    message: string,
    status: ResponseStatus,
    error?: string,
  ) {
    this.data = data;
    this.message = message;
    this.status = status;
    if (error) this.error = error;
  }
}
