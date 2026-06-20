import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import type { CurrentUserPayload } from '../../auth/types';
import { MemoriesRepository } from '../repositories/memories.repository';

@Injectable()
export class MemoryAuthorGuard implements CanActivate {
  constructor(private readonly memoriesRepo: MemoriesRepository) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user?: CurrentUserPayload; memory?: unknown }>();

    const user = req.user;
    if (!user) throw new UnauthorizedException();

    const raw = req.params?.id;
    const id = Array.isArray(raw) ? raw[0] : raw;
    if (!id) throw new BadRequestException('Missing id');

    const memory = await this.memoriesRepo.findById(id);
    if (!memory) throw new NotFoundException('Memory not found');

    if (memory.userId !== user.userId) {
      throw new ForbiddenException('Not the author');
    }

    (req as unknown as Record<string, unknown>)['memory'] = memory;
    return true;
  }
}
