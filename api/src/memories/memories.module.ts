import { Module } from '@nestjs/common';
import { PodsModule } from '../pods/pods.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { MemoriesController } from './memories.controller';
import { MemoriesService } from './memories.service';
import { CommentAuthorGuard } from './guards/comment-author.guard';
import { MemoryAuthorGuard } from './guards/memory-author.guard';
import { CommentsRepository } from './repositories/comments.repository';
import { MemoriesRepository } from './repositories/memories.repository';

@Module({
  imports: [PodsModule],
  controllers: [MemoriesController, CommentsController],
  providers: [
    MemoriesService,
    CommentsService,
    MemoriesRepository,
    CommentsRepository,
    MemoryAuthorGuard,
    CommentAuthorGuard,
  ],
  exports: [MemoriesRepository],
})
export class MemoriesModule {}
