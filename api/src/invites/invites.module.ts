import { Module } from '@nestjs/common';
import { PodsModule } from '../pods/pods.module';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { InviteRedemptionRepository } from './repositories/invite-redemption.repository';
import { InvitesRepository } from './repositories/invites.repository';

@Module({
  imports: [PodsModule],
  controllers: [InvitesController],
  providers: [InvitesService, InvitesRepository, InviteRedemptionRepository],
  exports: [InvitesService],
})
export class InvitesModule {}
