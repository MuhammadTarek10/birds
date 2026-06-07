import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
  ApiConflictResponse,
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
import type { PodContext } from '../common/types/request-with-pod';
import { CurrentPod } from './current-pod.decorator';
import { CreatePodDto } from './dto/create-pod.dto';
import { JoinPodDto } from './dto/join-pod.dto';
import { RenamePodDto } from './dto/rename-pod.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { PodListEnvelope } from './dto/responses/pod-list.envelope';
import { PodMemberEnvelope } from './dto/responses/pod-member.envelope';
import { PodMembersEnvelope } from './dto/responses/pod-members.envelope';
import { PodSummaryEnvelope } from './dto/responses/pod-summary.envelope';
import { PodMembershipGuard } from './guards/pod-membership.guard';
import { PodsService } from './pods.service';

@ApiTags('Pods')
@ApiCookieAuth('cookie-auth')
@ApiBearerAuth('bearer-auth')
@Controller('pods')
export class PodsController {
  constructor(private readonly pods: PodsService) {}

  @Post()
  @ResponseMessage('Pod created')
  @ApiOperation({ summary: 'Create a new pod; caller becomes admin' })
  @ApiCreatedResponse({ type: PodSummaryEnvelope })
  async create(
    @Body() dto: CreatePodDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.pods.createPod({ name: dto.name, creatorUserId: user.userId });
  }

  @Get()
  @ResponseMessage('Pods retrieved')
  @ApiOperation({ summary: 'List pods the current user belongs to' })
  @ApiOkResponse({ type: PodListEnvelope })
  async list(@CurrentUser() user: CurrentUserPayload) {
    const pods = await this.pods.listForUser(user.userId);
    return { pods };
  }

  @Post('join')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Joined pod')
  @ApiOperation({ summary: 'Join a pod by invite code' })
  @ApiOkResponse({ type: PodSummaryEnvelope })
  @ApiNotFoundResponse({
    type: ErrorResponse,
    description: 'Invite code not found',
  })
  @ApiConflictResponse({ type: ErrorResponse, description: 'Already a member' })
  async join(@Body() dto: JoinPodDto, @CurrentUser() user: CurrentUserPayload) {
    return this.pods.joinByCode(dto.code, user.userId);
  }

  @Get(':podId')
  @UseGuards(PodMembershipGuard)
  @ResponseMessage('Pod retrieved')
  @ApiOperation({ summary: 'Get a pod the caller is a member of' })
  @ApiOkResponse({ type: PodSummaryEnvelope })
  @ApiForbiddenResponse({
    type: ErrorResponse,
    description: 'Not a pod member',
  })
  async get(
    @Param('podId', ParseUUIDPipe) podId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.pods.getPodForUser(podId, user.userId);
  }

  @Patch(':podId')
  @UseGuards(PodMembershipGuard)
  @ResponseMessage('Pod renamed')
  @ApiOperation({ summary: 'Rename a pod (admin only)' })
  @ApiOkResponse({ type: PodSummaryEnvelope })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'Admin only' })
  async rename(
    @Param('podId', ParseUUIDPipe) podId: string,
    @Body() dto: RenamePodDto,
    @CurrentUser() user: CurrentUserPayload,
    @CurrentPod() pod: PodContext,
  ) {
    if (pod.role !== 'admin') throw new ForbiddenException('Admin only');
    return this.pods.renamePod(podId, dto.name, user.userId);
  }

  @Post(':podId/code/rotate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(PodMembershipGuard)
  @ResponseMessage('Pod code rotated')
  @ApiOperation({ summary: 'Generate a new invite code (admin only)' })
  @ApiOkResponse({ type: PodSummaryEnvelope })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'Admin only' })
  async rotateCode(
    @Param('podId', ParseUUIDPipe) podId: string,
    @CurrentUser() user: CurrentUserPayload,
    @CurrentPod() pod: PodContext,
  ) {
    if (pod.role !== 'admin') throw new ForbiddenException('Admin only');
    return this.pods.rotateCode(podId, user.userId);
  }

  @Get(':podId/members')
  @UseGuards(PodMembershipGuard)
  @ResponseMessage('Members retrieved')
  @ApiOperation({ summary: 'List all members of a pod' })
  @ApiOkResponse({ type: PodMembersEnvelope })
  async listMembers(@Param('podId', ParseUUIDPipe) podId: string) {
    const rows = await this.pods.listMembers(podId);
    return {
      members: rows.map((m) => ({
        id: m.id,
        role: m.role,
        joinedAt: m.joinedAt,
        user: {
          id: m.userId,
          email: m.email,
          firstName: m.firstName,
          lastName: m.lastName,
          avatarUrl: m.avatarUrl,
        },
      })),
    };
  }

  @Patch(':podId/members/:userId')
  @UseGuards(PodMembershipGuard)
  @ResponseMessage('Member updated')
  @ApiOperation({ summary: 'Promote or demote a member (admin only)' })
  @ApiOkResponse({ type: PodMemberEnvelope })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'Admin only' })
  @ApiConflictResponse({
    type: ErrorResponse,
    description: 'Cannot demote the last admin',
  })
  async updateMemberRole(
    @Param('podId', ParseUUIDPipe) podId: string,
    @Param('userId', ParseUUIDPipe) targetUserId: string,
    @Body() dto: UpdateMemberRoleDto,
    @CurrentPod() pod: PodContext,
  ) {
    const view = await this.pods.updateMemberRole({
      podId,
      targetUserId,
      newRole: dto.role,
      actorRole: pod.role,
    });
    return {
      id: view.id,
      role: view.role,
      joinedAt: view.joinedAt,
      user: {
        id: view.userId,
        email: view.email,
        firstName: view.firstName,
        lastName: view.lastName,
        avatarUrl: view.avatarUrl,
      },
    };
  }

  @Delete(':podId/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PodMembershipGuard)
  @ApiOperation({ summary: 'Remove a member (admin or self)' })
  @ApiNoContentResponse({ description: 'Member removed' })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'Admin only' })
  @ApiConflictResponse({
    type: ErrorResponse,
    description: 'Cannot remove the last admin',
  })
  async removeMember(
    @Param('podId', ParseUUIDPipe) podId: string,
    @Param('userId', ParseUUIDPipe) targetUserId: string,
    @CurrentUser() user: CurrentUserPayload,
    @CurrentPod() pod: PodContext,
  ) {
    await this.pods.removeMember({
      podId,
      targetUserId,
      actorUserId: user.userId,
      actorRole: pod.role,
    });
  }
}
