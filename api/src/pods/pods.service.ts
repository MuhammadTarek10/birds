import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PodAccountsRepository } from './repositories/pod-accounts.repository';
import {
  PodMembersRepository,
  type MemberWithUserRow,
  type MembershipRow,
  type PodForUserRow,
} from './repositories/pod-members.repository';
import { PodsRepository, type PodRow } from './repositories/pods.repository';
import { UpdateMembershipRoleInput } from './dto/update-membership-role.input';
import { RemoveMemberInput } from './dto/remove-member.input';

export type PodSummary = PodForUserRow;
export type PodMemberView = MemberWithUserRow;

const toSummary = (
  pod: PodRow,
  membership: Pick<MembershipRow, 'role' | 'joinedAt'>,
  memberCount: number,
): PodSummary => ({
  id: pod.id,
  name: pod.name,
  code: pod.code,
  role: membership.role,
  joinedAt: membership.joinedAt,
  memberCount,
});

@Injectable()
export class PodsService {
  constructor(
    private readonly pods: PodsRepository,
    private readonly members: PodMembersRepository,
    private readonly accounts: PodAccountsRepository,
  ) {}

  async createPod(input: {
    name: string;
    creatorUserId: string;
  }): Promise<PodSummary> {
    const created = await this.accounts.createWithCreator(input);
    return toSummary(
      created,
      { role: created.role, joinedAt: created.joinedAt },
      1,
    );
  }

  listForUser(userId: string): Promise<PodSummary[]> {
    return this.members.listForUser(userId);
  }

  async getPodForUser(podId: string, userId: string): Promise<PodSummary> {
    const pod = await this.pods.findById(podId);
    if (!pod) throw new NotFoundException('Pod not found');
    return this.summaryForUser(pod, userId);
  }

  async renamePod(
    podId: string,
    name: string,
    userId: string,
  ): Promise<PodSummary> {
    const updated = await this.pods.updateName(podId, name);
    if (!updated) throw new NotFoundException('Pod not found');
    return this.summaryForUser(updated, userId);
  }

  async rotateCode(podId: string, userId: string): Promise<PodSummary> {
    const rotated = await this.accounts.rotateCode(podId);
    if (!rotated) throw new NotFoundException('Pod not found');
    return this.summaryForUser(rotated, userId);
  }

  async joinByCode(code: string, userId: string): Promise<PodSummary> {
    const pod = await this.pods.findByCode(code);
    if (!pod) throw new NotFoundException('Invite code not found');

    const existing = await this.members.findByPodAndUser(pod.id, userId);
    if (existing) throw new ConflictException('Already a member of this pod');

    const member = await this.members.insert({
      podId: pod.id,
      userId,
      role: 'member',
    });
    const memberCount = await this.members.countMembers(pod.id);
    return toSummary(pod, member, memberCount);
  }

  listMembers(podId: string): Promise<PodMemberView[]> {
    return this.members.listMembers(podId);
  }

  async updateMemberRole(
    input: UpdateMembershipRoleInput,
  ): Promise<PodMemberView> {
    if (input.actorRole !== 'admin') throw new ForbiddenException('Admin only');

    const current = await this.members.findByPodAndUser(
      input.podId,
      input.targetUserId,
    );
    if (!current) throw new NotFoundException('Member not found');

    if (current.role === 'admin' && input.newRole !== 'admin') {
      await this.assertNotLastAdmin(input.podId);
    }

    const updated = await this.members.updateRole(
      input.podId,
      input.targetUserId,
      input.newRole,
    );
    if (!updated) throw new NotFoundException('Member not found');

    const view = await this.members.findMemberWithUser(
      input.podId,
      input.targetUserId,
    );
    if (!view) throw new NotFoundException('Member not found');
    return view;
  }

  async removeMember(input: RemoveMemberInput): Promise<void> {
    const isSelf = input.actorUserId === input.targetUserId;
    if (!isSelf && input.actorRole !== 'admin') {
      throw new ForbiddenException('Admin only');
    }

    const target = await this.members.findByPodAndUser(
      input.podId,
      input.targetUserId,
    );
    if (!target) throw new NotFoundException('Member not found');

    if (target.role === 'admin') {
      await this.assertNotLastAdmin(input.podId);
    }

    await this.members.remove(input.podId, input.targetUserId);
  }

  private async summaryForUser(
    pod: PodRow,
    userId: string,
  ): Promise<PodSummary> {
    const membership = await this.members.findByPodAndUser(pod.id, userId);
    if (!membership) throw new ForbiddenException('Not a pod member');
    const memberCount = await this.members.countMembers(pod.id);
    return toSummary(pod, membership, memberCount);
  }

  private async assertNotLastAdmin(podId: string): Promise<void> {
    const adminCount = await this.members.countAdmins(podId);
    if (adminCount <= 1) {
      throw new ConflictException('Cannot demote or remove the last admin');
    }
  }
}
