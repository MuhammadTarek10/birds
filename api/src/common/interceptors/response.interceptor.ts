import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';
import { ResponseDto, ResponseStatus } from '../dto/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseDto<T> | undefined
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<T> | undefined> {
    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, ctx.getHandler()) ??
      'Operation successful';

    return next.handle().pipe(
      map((data) => {
        if (data === undefined || data === null) return undefined;
        if (data instanceof ResponseDto) return data;
        return new ResponseDto(data, message, ResponseStatus.SUCCESS);
      }),
    );
  }
}
