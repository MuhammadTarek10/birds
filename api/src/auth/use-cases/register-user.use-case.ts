import { Injectable } from '@nestjs/common';
import { TransactionManager } from '../../database/transaction-manager';
import { InvitesService } from '../../invites/invites.service';
import { PodAccountsRepository } from '../../pods/repositories/pod-accounts.repository';
import { derivePodName, emailLocalPart } from '../../pods/utils/pod-name';
import { RegisterDto } from '../dto/register.dto';
import {
  UserAuthService,
  type AuthedUser,
} from '../services/user-auth.service';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userAuth: UserAuthService,
    private readonly invites: InvitesService,
    private readonly podAccounts: PodAccountsRepository,
    private readonly tm: TransactionManager,
  ) {}

  execute(input: RegisterDto): Promise<AuthedUser> {
    return this.tm.run(async () => {
      const user = await this.userAuth.registerLocal({
        email: input.email,
        password: input.password,
        firstName: input.firstName,
        lastName: input.lastName,
      });

      if (input.inviteToken) {
        await this.invites.redeemForUser({
          token: input.inviteToken,
          userId: user.userId,
          userEmail: user.email,
        });
      } else {
        const seed = input.firstName?.trim() || emailLocalPart(input.email);
        await this.podAccounts.createWithCreator({
          name: derivePodName(seed),
          creatorUserId: user.userId,
        });
      }

      return user;
    });
  }
}
