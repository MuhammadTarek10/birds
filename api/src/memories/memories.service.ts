import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PodMembersRepository } from '../pods/repositories/pod-members.repository';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { ListMemoriesQuery } from './dto/list-memories.query';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import {
  MemoriesRepository,
  type MemoryWithAuthorRow,
} from './repositories/memories.repository';

@Injectable()
export class MemoriesService {
  constructor(
    private readonly memoriesRepo: MemoriesRepository,
    private readonly podMembersRepo: PodMembersRepository,
  ) {}

  async list(
    podId: string,
    query: ListMemoriesQuery,
  ): Promise<{ memories: MemoryWithAuthorRow[]; nextCursor: string | null }> {
    const limit = query.limit ?? 20;
    const { rows, nextCursor } = await this.memoriesRepo.list(podId, {
      cursor: query.cursor,
      limit,
    });
    return { memories: rows, nextCursor };
  }

  async findById(id: string, userId: string): Promise<MemoryWithAuthorRow> {
    const memory = await this.memoriesRepo.findByIdWithAuthor(id);
    if (!memory) throw new NotFoundException('Memory not found');

    const membership = await this.podMembersRepo.findByPodAndUser(
      memory.podId,
      userId,
    );
    if (!membership) throw new ForbiddenException('Not a pod member');

    return memory;
  }

  async create(
    podId: string,
    userId: string,
    dto: CreateMemoryDto,
  ): Promise<MemoryWithAuthorRow> {
    return this.memoriesRepo.create({
      podId,
      userId,
      title: dto.title,
      eventDate: dto.eventDate,
      description: dto.description,
      location: dto.location,
    });
  }

  async update(id: string, dto: UpdateMemoryDto): Promise<MemoryWithAuthorRow> {
    const updated = await this.memoriesRepo.update(id, {
      title: dto.title,
      eventDate: dto.eventDate,
      description: dto.description,
      location: dto.location,
    });
    if (!updated) throw new NotFoundException('Memory not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.memoriesRepo.delete(id);
  }
}
