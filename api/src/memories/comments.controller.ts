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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  CommentEnvelope,
  CommentListEnvelope,
} from './dto/responses/comment-list.envelope';
import { CommentAuthorGuard } from './guards/comment-author.guard';

@ApiTags('Comments')
@ApiCookieAuth('cookie-auth')
@ApiBearerAuth('bearer-auth')
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('memories/:memoryId/comments')
  @ResponseMessage('Comments retrieved')
  @ApiOperation({ summary: 'List comments for a memory' })
  @ApiOkResponse({ type: CommentListEnvelope })
  @ApiNotFoundResponse({ type: ErrorResponse, description: 'Memory not found' })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'Not a pod member' })
  async listForMemory(
    @Param('memoryId', ParseUUIDPipe) memoryId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const commentRows = await this.commentsService.listForMemory(
      memoryId,
      user.userId,
    );
    return {
      comments: commentRows.map((c) => ({
        id: c.id,
        memoryId: c.memoryId,
        userId: c.userId,
        content: c.content,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        author: { id: c.authorId, name: c.authorName },
      })),
    };
  }

  @Post('memories/:memoryId/comments')
  @ResponseMessage('Comment created')
  @ApiOperation({ summary: 'Add a comment to a memory' })
  @ApiCreatedResponse({ type: CommentEnvelope })
  @ApiNotFoundResponse({ type: ErrorResponse, description: 'Memory not found' })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'Not a pod member' })
  async create(
    @Param('memoryId', ParseUUIDPipe) memoryId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const comment = await this.commentsService.create(
      memoryId,
      user.userId,
      dto,
    );
    return {
      id: comment.id,
      memoryId: comment.memoryId,
      userId: comment.userId,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: { id: comment.authorId, name: comment.authorName },
    };
  }

  @Patch('comments/:id')
  @UseGuards(CommentAuthorGuard)
  @ResponseMessage('Comment updated')
  @ApiOperation({ summary: 'Update a comment (author only)' })
  @ApiOkResponse({ type: CommentEnvelope })
  @ApiNotFoundResponse({ type: ErrorResponse, description: 'Comment not found' })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'Not the author' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCommentDto,
  ) {
    const comment = await this.commentsService.update(id, dto.content);
    return {
      id: comment.id,
      memoryId: comment.memoryId,
      userId: comment.userId,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: { id: comment.authorId, name: comment.authorName },
    };
  }

  @Delete('comments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CommentAuthorGuard)
  @ApiOperation({ summary: 'Delete a comment (author only)' })
  @ApiNoContentResponse({ description: 'Comment deleted' })
  @ApiNotFoundResponse({ type: ErrorResponse, description: 'Comment not found' })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'Not the author' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.commentsService.delete(id);
  }
}
