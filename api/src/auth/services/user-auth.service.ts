import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FindOrLinkGoogleInput } from '../dto/find-or-link-google.input';
import { RegisterLocalInput } from '../dto/register-local.input';
import { AuthCredentialsRepository } from '../repositories/auth-credentials.repository';
import { UserAccountsRepository } from '../repositories/user-accounts.repository';
import { UsersRepository } from '../repositories/users.repository';
import { PasswordService } from './password.service';

const LOCK_THRESHOLD = 5;
const LOCK_DURATION_MS = 15 * 60_000;

export type AuthedUser = {
  userId: string;
  authId: string;
  email: string;
  role: string;
};

@Injectable()
export class UserAuthService {
  constructor(
    private readonly users: UsersRepository,
    private readonly creds: AuthCredentialsRepository,
    private readonly accounts: UserAccountsRepository,
    private readonly passwords: PasswordService,
  ) {}

  async registerLocal(input: RegisterLocalInput): Promise<AuthedUser> {
    const existing = await this.users.findByEmail(input.email);
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await this.passwords.hash(input.password);
    return this.accounts.createLocalAccount({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    });
  }

  async loginLocal(email: string, password: string): Promise<AuthedUser> {
    const row = await this.creds.findLocalByEmail(email);
    if (!row || !row.passwordHash)
      throw new UnauthorizedException('Invalid credentials');

    if (row.lockedUntil && row.lockedUntil.getTime() > Date.now()) {
      throw new HttpException(
        'Account temporarily locked',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const ok = await this.passwords.verify(row.passwordHash, password);
    if (!ok) {
      const nextCount = (row.failedAttempts ?? 0) + 1;
      const lockedUntil =
        nextCount >= LOCK_THRESHOLD
          ? new Date(Date.now() + LOCK_DURATION_MS)
          : null;
      await this.creds.recordFailedAttempt(row.authId, nextCount, lockedUntil);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.creds.resetFailedAttempts(row.authId);

    return {
      userId: row.userId,
      authId: row.authId,
      email: row.email,
      role: row.role,
    };
  }

  loadByAuthId(authId: string): Promise<AuthedUser | null> {
    return this.creds.findUserBundleById(authId);
  }

  async findOrLinkGoogle(input: FindOrLinkGoogleInput): Promise<AuthedUser> {
    const existing = await this.creds.findByProviderUserId(
      'google',
      input.providerUserId,
    );
    if (existing) return existing;

    const byEmail = await this.users.findByEmail(input.email);
    if (byEmail) {
      if (!input.emailVerified) throw new ConflictException('link_required');
      const authId = await this.accounts.linkGoogleProvider({
        userId: byEmail.id,
        providerUserId: input.providerUserId,
      });
      return {
        userId: byEmail.id,
        authId,
        email: byEmail.email,
        role: byEmail.role,
      };
    }

    return this.accounts.createGoogleAccount({
      email: input.email,
      providerUserId: input.providerUserId,
      emailVerified: input.emailVerified,
      firstName: input.firstName,
      lastName: input.lastName,
      avatarUrl: input.avatarUrl,
    });
  }

  loadMe(userId: string) {
    return this.users.findMeById(userId);
  }
}
