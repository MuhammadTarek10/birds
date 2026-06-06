import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ required: false, example: 'Bad Request' })
  error?: string;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: 'Invalid credentials',
  })
  message!: string | string[];

  @ApiProperty({ example: '/api/auth/login' })
  path!: string;

  @ApiProperty({ example: '2026-06-06T12:00:00.000Z' })
  timestamp!: string;
}
