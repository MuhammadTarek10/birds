import {
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { CONFIG } from '../config/config.constants';
import { PodMembersRepository } from '../pods/repositories/pod-members.repository';
import { PodsRepository } from '../pods/repositories/pods.repository';
import { CreateInviteInput } from './dto/create-invite.input';
import { RedeemInviteInput } from './dto/redeem-invite.input';
import { InviteRedemptionRepository } from './repositories/invite-redemption.repository';
import {
  InvitesRepository,
  type InviteRow,
} from './repositories/invites.repository';

const DEFAULT_TTL_HOURS = 168; // 7 days
const TOKEN_BYTES = 24;

export type InviteView = InviteRow & { inviteUrl: string };

@Injectable()
export class InvitesService {
  private readonly logger = new Logger(InvitesService.name);
  private readonly webOrigin: string;

  constructor(
    private readonly invites: InvitesRepository,
    private readonly pods: PodsRepository,
    private readonly members: PodMembersRepository,
    private readonly redemption: InviteRedemptionRepository,
    config: ConfigService,
  ) {
    this.webOrigin = config.get<string>(CONFIG.app.webOrigin) ?? '';
  }

  async create(input: CreateInviteInput): Promise<InviteView> {
    const ttlHours = input.expiresInHours ?? DEFAULT_TTL_HOURS;
    const expiresAt = new Date(Date.now() + ttlHours * 60 * 60_000);
    const token = randomBytes(TOKEN_BYTES).toString('base64url');

    const row = await this.invites.insert({
      token,
      podId: input.podId,
      createdBy: input.createdBy,
      email: input.email?.toLowerCase() ?? null,
      expiresAt,
    });

    this.logger.log(
      `Invite created for pod ${input.podId} (${this.toUrl(token)})`,
    );
    return this.toView(row);
  }

  async listForPod(podId: string): Promise<InviteView[]> {
    const rows = await this.invites.listForPod(podId);
    return rows.map((r) => this.toView(r));
  }

  async revoke(podId: string, inviteId: string): Promise<void> {
    const invite = await this.invites.findById(inviteId);
    if (!invite || invite.podId !== podId) {
      throw new NotFoundException('Invite not found');
    }
    if (invite.redeemedAt)
      throw new ConflictException('Invite already redeemed');
    if (invite.revokedAt) return;
    await this.invites.revoke(inviteId);
  }

  async preview(
    token: string,
  ): Promise<{ podName: string; email: string | null; expiresAt: Date }> {
    const invite = await this.invites.findActiveByToken(token);
    if (!invite) throw new GoneException('Invite is no longer valid');
    const pod = await this.pods.findById(invite.podId);
    if (!pod) throw new NotFoundException('Pod not found');
    return {
      podName: pod.name,
      email: invite.email,
      expiresAt: invite.expiresAt,
    };
  }

  async redeemForUser(
    input: RedeemInviteInput,
  ): Promise<{ podId: string; podName: string }> {
    const invite = await this.invites.findActiveByToken(input.token);
    if (!invite) throw new GoneException('Invite is no longer valid');

    if (
      invite.email &&
      invite.email.toLowerCase() !== input.userEmail.toLowerCase()
    ) {
      throw new ForbiddenException('Invite is for a different email');
    }

    const existing = await this.members.findByPodAndUser(
      invite.podId,
      input.userId,
    );
    if (existing) throw new ConflictException('Already a member of this pod');

    const pod = await this.pods.findById(invite.podId);
    if (!pod) throw new NotFoundException('Pod not found');

    const ok = await this.redemption.redeem({
      inviteId: invite.id,
      podId: invite.podId,
      userId: input.userId,
    });
    if (!ok) throw new GoneException('Invite is no longer valid');
    return { podId: pod.id, podName: pod.name };
  }

  toView(row: InviteRow): InviteView {
    return { ...row, inviteUrl: this.toUrl(row.token) };
  }

  private toUrl(token: string): string {
    return `${this.webOrigin}/invite/${token}`;
  }
}
