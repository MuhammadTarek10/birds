import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PodMembersRepository } from '../pods/repositories/pod-members.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  CommentsRepository,
  type CommentWithAuthorRow,
} from './repositories/comments.repository';
import { MemoriesRepository } from './repositories/memories.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepo: CommentsRepository,
    private readonly memoriesRepo: MemoriesRepository,
    private readonly podMembersRepo: PodMembersRepository,
  ) {}

  async listForMemory(
    memoryId: string,
    userId: string,
  ): Promise<CommentWithAuthorRow[]> {
    const memory = await this.memoriesRepo.findById(memoryId);
    if (!memory) throw new NotFoundException('Memory not found');

    const membership = await this.podMembersRepo.findByPodAndUser(
      memory.podId,
      userId,
    );
    if (!membership) throw new ForbiddenException('Not a pod member');

    return this.commentsRepo.listForMemory(memoryId);
  }

  async create(
    memoryId: string,
    userId: string,
    dto: CreateCommentDto,
  ): Promise<CommentWithAuthorRow> {
    const memory = await this.memoriesRepo.findById(memoryId);
    if (!memory) throw new NotFoundException('Memory not found');

    const membership = await this.podMembersRepo.findByPodAndUser(
      memory.podId,
      userId,
    );
    if (!membership) throw new ForbiddenException('Not a pod member');

    return this.commentsRepo.create({
      memoryId,
      userId,
      content: dto.content,
    });
  }

  async update(id: string, content: string): Promise<CommentWithAuthorRow> {
    const updated = await this.commentsRepo.update(id, content);
    if (!updated) throw new NotFoundException('Comment not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.commentsRepo.delete(id);
  }
}
