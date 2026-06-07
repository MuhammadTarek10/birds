import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { setPodContext } from '../../common/types/request-with-pod';
import type { CurrentUserPayload } from '../../auth/types';
import { PodMembersRepository } from '../repositories/pod-members.repository';

@Injectable()
export class PodMembershipGuard implements CanActivate {
  constructor(private readonly members: PodMembersRepository) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user?: CurrentUserPayload }>();
    const user = req.user;
    if (!user) throw new UnauthorizedException();

    const raw = req.params?.podId;
    const podId = Array.isArray(raw) ? raw[0] : raw;
    if (!podId) throw new BadRequestException('Missing podId');

    const membership = await this.members.findByPodAndUser(podId, user.userId);
    if (!membership) throw new ForbiddenException('Not a pod member');

    setPodContext(req, { podId, role: membership.role });
    return true;
  }
}
