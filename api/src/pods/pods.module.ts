import { Module } from '@nestjs/common';
import { PodsController } from './pods.controller';
import { PodsService } from './pods.service';
import { PodMembershipGuard } from './guards/pod-membership.guard';
import { PodAccountsRepository } from './repositories/pod-accounts.repository';
import { PodMembersRepository } from './repositories/pod-members.repository';
import { PodsRepository } from './repositories/pods.repository';

@Module({
  controllers: [PodsController],
  providers: [
    PodsService,
    PodsRepository,
    PodMembersRepository,
    PodAccountsRepository,
    PodMembershipGuard,
  ],
  exports: [PodMembershipGuard, PodMembersRepository],
})
export class PodsModule {}
