import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';
import {
  getPodContext,
  type PodContext,
} from '../common/types/request-with-pod';

export const CurrentPod = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): PodContext => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const pod = getPodContext(req);
    if (!pod) {
      throw new Error('CurrentPod decorator used without PodMembershipGuard');
    }
    return pod;
  },
);
