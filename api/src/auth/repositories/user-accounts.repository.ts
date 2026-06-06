import { Injectable } from '@nestjs/common';
import { TransactionManager } from '../../database/transaction-manager';
import { AuthCredentialsRepository } from './auth-credentials.repository';
import { UserProfilesRepository } from './user-profiles.repository';
import { UsersRepository } from './users.repository';

export type AccountRow = {
  userId: string;
  authId: string;
  email: string;
  role: string;
};

@Injectable()
export class UserAccountsRepository {
  constructor(
    private readonly tm: TransactionManager,
    private readonly users: UsersRepository,
    private readonly profiles: UserProfilesRepository,
    private readonly creds: AuthCredentialsRepository,
  ) {}

  createLocalAccount(input: {
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
  }): Promise<AccountRow> {
    return this.tm.run(async () => {
      const user = await this.users.insert({
        email: input.email,
        status: 'active',
        role: 'member',
      });
      await this.profiles.insert({
        userId: user.id,
        firstName: input.firstName,
        lastName: input.lastName,
      });
      const authId = await this.creds.insertLocal({
        userId: user.id,
        passwordHash: input.passwordHash,
      });
      return { userId: user.id, authId, email: user.email, role: user.role };
    });
  }

  createGoogleAccount(input: {
    email: string;
    providerUserId: string;
    emailVerified: boolean;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  }): Promise<AccountRow> {
    return this.tm.run(async () => {
      const user = await this.users.insert({
        email: input.email,
        status: 'active',
        role: 'member',
        emailVerifiedAt: input.emailVerified ? new Date() : null,
      });
      await this.profiles.insert({
        userId: user.id,
        firstName: input.firstName,
        lastName: input.lastName,
        avatarUrl: input.avatarUrl,
      });
      const authId = await this.creds.insertGoogle({
        userId: user.id,
        providerUserId: input.providerUserId,
        isPrimary: true,
      });
      return { userId: user.id, authId, email: user.email, role: user.role };
    });
  }

  linkGoogleProvider(input: {
    userId: string;
    providerUserId: string;
  }): Promise<string> {
    return this.creds.insertGoogle({
      userId: input.userId,
      providerUserId: input.providerUserId,
      isPrimary: false,
    });
  }
}
