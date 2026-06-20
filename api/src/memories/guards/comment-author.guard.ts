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
import { CommentsRepository } from '../repositories/comments.repository';

@Injectable()
export class CommentAuthorGuard implements CanActivate {
  constructor(private readonly commentsRepo: CommentsRepository) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { user?: CurrentUserPayload; comment?: unknown }>();

    const user = req.user;
    if (!user) throw new UnauthorizedException();

    const raw = req.params?.id;
    const id = Array.isArray(raw) ? raw[0] : raw;
    if (!id) throw new BadRequestException('Missing id');

    const comment = await this.commentsRepo.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.userId !== user.userId) {
      throw new ForbiddenException('Not the author');
    }

    (req as unknown as Record<string, unknown>)['comment'] = comment;
    return true;
  }
}
