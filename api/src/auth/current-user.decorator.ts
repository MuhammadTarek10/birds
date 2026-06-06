import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';
import type { CurrentUserPayload } from './types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user: CurrentUserPayload }>();
    return req.user;
  },
);
