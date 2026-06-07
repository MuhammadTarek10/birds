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
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiGoneResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/types';
import { Public } from '../common/decorators/public.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { ErrorResponse } from '../common/dto/error.response';
import type { PodContext } from '../common/types/request-with-pod';
import { CurrentPod } from '../pods/current-pod.decorator';
import { PodMembershipGuard } from '../pods/guards/pod-membership.guard';
import { CreateInviteDto } from './dto/create-invite.dto';
import { RedeemInviteDto } from './dto/redeem-invite.dto';
import { InviteListEnvelope } from './dto/responses/invite-list.envelope';
import { InvitePreviewEnvelope } from './dto/responses/invite-preview.envelope';
import { InviteEnvelope } from './dto/responses/invite.envelope';
import { InvitesService } from './invites.service';

@ApiTags('Invites')
@Controller()
export class InvitesController {
  constructor(private readonly invites: InvitesService) {}

  @Post('pods/:podId/invites')
  @UseGuards(PodMembershipGuard)
  @ApiCookieAuth('cookie-auth')
  @ApiBearerAuth('bearer-auth')
  @ResponseMessage('Invite created')
  @ApiOperation({
    summary: 'Create a single-use invite for a pod (admin only)',
  })
  @ApiCreatedResponse({ type: InviteEnvelope })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'Admin only' })
  async create(
    @Param('podId', ParseUUIDPipe) podId: string,
    @Body() dto: CreateInviteDto,
    @CurrentUser() user: CurrentUserPayload,
    @CurrentPod() pod: PodContext,
  ) {
    if (pod.role !== 'admin') throw new ForbiddenException('Admin only');
    return this.invites.create({
      podId,
      createdBy: user.userId,
      email: dto.email,
      expiresInHours: dto.expiresInHours,
    });
  }

  @Get('pods/:podId/invites')
  @UseGuards(PodMembershipGuard)
  @ApiCookieAuth('cookie-auth')
  @ApiBearerAuth('bearer-auth')
  @ResponseMessage('Invites retrieved')
  @ApiOperation({ summary: "List a pod's invites (admin only)" })
  @ApiOkResponse({ type: InviteListEnvelope })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'Admin only' })
  async list(
    @Param('podId', ParseUUIDPipe) podId: string,
    @CurrentPod() pod: PodContext,
  ) {
    if (pod.role !== 'admin') throw new ForbiddenException('Admin only');
    const invites = await this.invites.listForPod(podId);
    return { invites };
  }

  @Delete('pods/:podId/invites/:inviteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PodMembershipGuard)
  @ApiCookieAuth('cookie-auth')
  @ApiBearerAuth('bearer-auth')
  @ApiOperation({ summary: 'Revoke a pending invite (admin only)' })
  @ApiNoContentResponse({ description: 'Invite revoked' })
  @ApiForbiddenResponse({ type: ErrorResponse, description: 'Admin only' })
  @ApiNotFoundResponse({ type: ErrorResponse, description: 'Invite not found' })
  @ApiConflictResponse({
    type: ErrorResponse,
    description: 'Invite already redeemed',
  })
  async revoke(
    @Param('podId', ParseUUIDPipe) podId: string,
    @Param('inviteId', ParseUUIDPipe) inviteId: string,
    @CurrentPod() pod: PodContext,
  ) {
    if (pod.role !== 'admin') throw new ForbiddenException('Admin only');
    await this.invites.revoke(podId, inviteId);
  }

  @Public()
  @ApiSecurity({})
  @Get('invites/:token')
  @ResponseMessage('Invite retrieved')
  @ApiOperation({
    summary: 'Preview an invite (public — for the landing page)',
  })
  @ApiOkResponse({ type: InvitePreviewEnvelope })
  @ApiGoneResponse({
    type: ErrorResponse,
    description: 'Invite is no longer valid',
  })
  async preview(@Param('token') token: string) {
    return this.invites.preview(token);
  }

  @Post('invites/redeem')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('cookie-auth')
  @ApiBearerAuth('bearer-auth')
  @ResponseMessage('Joined pod')
  @ApiOperation({ summary: 'Redeem an invite as the current user' })
  @ApiOkResponse({
    schema: { properties: { podId: { type: 'string', format: 'uuid' } } },
  })
  @ApiGoneResponse({
    type: ErrorResponse,
    description: 'Invite is no longer valid',
  })
  @ApiForbiddenResponse({
    type: ErrorResponse,
    description: 'Invite is for a different email',
  })
  @ApiConflictResponse({ type: ErrorResponse, description: 'Already a member' })
  async redeem(
    @Body() dto: RedeemInviteDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.invites.redeemForUser({
      token: dto.token,
      userId: user.userId,
      userEmail: user.email,
    });
  }
}
