import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/types';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { ErrorResponse } from '../common/dto/error.response';
import { PodMembershipGuard } from '../pods/guards/pod-membership.guard';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { ListMemoriesQuery } from './dto/list-memories.query';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import {
  MemoryEnvelope,
  MemoryListEnvelope,
} from './dto/responses/memory-list.envelope';
import { MemoryAuthorGuard } from './guards/memory-author.guard';
import { MemoriesService } from './memories.service';

@ApiTags('Memories')
@ApiCookieAuth('cookie-auth')
@ApiBearerAuth('bearer-auth')
@Controller()
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) {}

  @Get('pods/:podId/memories')
  @UseGuards(PodMembershipGuard)
  @ResponseMessage('Memories retrieved')
  @ApiOperation({ summary: 'List memories in a pod (cursor-paginated)' })
  @ApiOkResponse({ type: MemoryListEnvelope })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'Not a pod member' })
  async list(
    @Param('podId', ParseUUIDPipe) podId: string,
    @Query() query: ListMemoriesQuery,
  ) {
    const { memories, nextCursor } = await this.memoriesService.list(
      podId,
      query,
    );
    return {
      memories: memories.map((m) => ({
        id: m.id,
        podId: m.podId,
        userId: m.userId,
        title: m.title,
        description: m.description,
        location: m.location,
        eventDate: m.eventDate,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        author: { id: m.authorId, name: m.authorName },
      })),
      nextCursor,
    };
  }

  @Post('pods/:podId/memories')
  @UseGuards(PodMembershipGuard)
  @ResponseMessage('Memory created')
  @ApiOperation({ summary: 'Create a memory in a pod' })
  @ApiCreatedResponse({ type: MemoryEnvelope })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'Not a pod member' })
  async create(
    @Param('podId', ParseUUIDPipe) podId: string,
    @Body() dto: CreateMemoryDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const memory = await this.memoriesService.create(podId, user.userId, dto);
    return {
      id: memory.id,
      podId: memory.podId,
      userId: memory.userId,
      title: memory.title,
      description: memory.description,
      location: memory.location,
      eventDate: memory.eventDate,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt,
      author: { id: memory.authorId, name: memory.authorName },
    };
  }

  @Get('memories/:id')
  @ResponseMessage('Memory retrieved')
  @ApiOperation({ summary: 'Get a single memory (membership checked)' })
  @ApiOkResponse({ type: MemoryEnvelope })
  @ApiNotFoundResponse({ type: ErrorResponse, description: 'Memory not found' })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'Not a pod member' })
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const memory = await this.memoriesService.findById(id, user.userId);
    return {
      id: memory.id,
      podId: memory.podId,
      userId: memory.userId,
      title: memory.title,
      description: memory.description,
      location: memory.location,
      eventDate: memory.eventDate,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt,
    };
  }

  @Patch('memories/:id')
  @UseGuards(MemoryAuthorGuard)
  @ResponseMessage('Memory updated')
  @ApiOperation({ summary: 'Update a memory (author only)' })
  @ApiOkResponse({ type: MemoryEnvelope })
  @ApiNotFoundResponse({ type: ErrorResponse, description: 'Memory not found' })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'Not the author' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMemoryDto,
  ) {
    const memory = await this.memoriesService.update(id, dto);
    return {
      id: memory.id,
      podId: memory.podId,
      userId: memory.userId,
      title: memory.title,
      description: memory.description,
      location: memory.location,
      eventDate: memory.eventDate,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt,
    };
  }

  @Delete('memories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(MemoryAuthorGuard)
  @ApiOperation({ summary: 'Delete a memory (author only)' })
  @ApiNoContentResponse({ description: 'Memory deleted' })
  @ApiNotFoundResponse({ type: ErrorResponse, description: 'Memory not found' })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'Not the author' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.memoriesService.delete(id);
  }
}
