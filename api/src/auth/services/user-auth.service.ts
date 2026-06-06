import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DRIZZLE_DB, type Database } from '../../database/database.module';
import { auth, users, usersProfiles } from '../../database/schema';
import { FindOrLinkGoogleInput } from '../dto/find-or-link-google.input';
import { RegisterLocalInput } from '../dto/register-local.input';
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
    @Inject(DRIZZLE_DB) private readonly db: Database,
    private readonly passwords: PasswordService,
  ) {}

  async registerLocal(input: RegisterLocalInput): Promise<AuthedUser> {
    const existing = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);
    if (existing.length > 0)
      throw new ConflictException('Email already registered');

    const passwordHash = await this.passwords.hash(input.password);

    return this.db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({ email: input.email, status: 'active', role: 'member' })
        .returning({ id: users.id, email: users.email, role: users.role });

      await tx.insert(usersProfiles).values({
        userId: user.id,
        firstName: input.firstName,
        lastName: input.lastName,
      });

      const [a] = await tx
        .insert(auth)
        .values({
          userId: user.id,
          provider: 'local',
          isPrimary: true,
          passwordHash,
        })
        .returning({ id: auth.id });

      return {
        userId: user.id,
        authId: a.id,
        email: user.email,
        role: user.role,
      };
    });
  }

  async loginLocal(email: string, password: string): Promise<AuthedUser> {
    const [row] = await this.db
      .select({
        authId: auth.id,
        userId: users.id,
        email: users.email,
        role: users.role,
        passwordHash: auth.passwordHash,
        failedAttempts: auth.failedAttempts,
        lockedUntil: auth.lockedUntil,
      })
      .from(auth)
      .innerJoin(users, eq(users.id, auth.userId))
      .where(and(eq(users.email, email), eq(auth.provider, 'local')))
      .limit(1);

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
      await this.recordFailedAttempt(row.authId, (row.failedAttempts ?? 0) + 1);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.db
      .update(auth)
      .set({ failedAttempts: 0, lockedUntil: null, lastUsedAt: new Date() })
      .where(eq(auth.id, row.authId));

    return {
      userId: row.userId,
      authId: row.authId,
      email: row.email,
      role: row.role,
    };
  }

  async loadByAuthId(authId: string): Promise<AuthedUser | null> {
    const [row] = await this.db
      .select({
        authId: auth.id,
        userId: users.id,
        email: users.email,
        role: users.role,
      })
      .from(auth)
      .innerJoin(users, eq(users.id, auth.userId))
      .where(eq(auth.id, authId))
      .limit(1);
    return row ?? null;
  }

  async findOrLinkGoogle(input: FindOrLinkGoogleInput): Promise<AuthedUser> {
    const [existingAuth] = await this.db
      .select({
        authId: auth.id,
        userId: users.id,
        email: users.email,
        role: users.role,
      })
      .from(auth)
      .innerJoin(users, eq(users.id, auth.userId))
      .where(
        and(
          eq(auth.provider, 'google'),
          eq(auth.providerUserId, input.providerUserId),
        ),
      )
      .limit(1);

    if (existingAuth) return existingAuth;

    const [byEmail] = await this.db
      .select({ id: users.id, email: users.email, role: users.role })
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (byEmail) {
      if (!input.emailVerified) {
        throw new ConflictException('link_required');
      }
      const [a] = await this.db
        .insert(auth)
        .values({
          userId: byEmail.id,
          provider: 'google',
          providerUserId: input.providerUserId,
          isPrimary: false,
        })
        .returning({ id: auth.id });
      return {
        userId: byEmail.id,
        authId: a.id,
        email: byEmail.email,
        role: byEmail.role,
      };
    }

    return this.db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email: input.email,
          status: 'active',
          role: 'member',
          emailVerifiedAt: input.emailVerified ? new Date() : null,
        })
        .returning({ id: users.id, email: users.email, role: users.role });

      await tx.insert(usersProfiles).values({
        userId: user.id,
        firstName: input.firstName,
        lastName: input.lastName,
        avatarUrl: input.avatarUrl,
      });

      const [a] = await tx
        .insert(auth)
        .values({
          userId: user.id,
          provider: 'google',
          providerUserId: input.providerUserId,
          isPrimary: true,
        })
        .returning({ id: auth.id });

      return {
        userId: user.id,
        authId: a.id,
        email: user.email,
        role: user.role,
      };
    });
  }

  async loadMe(userId: string) {
    const [row] = await this.db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        status: users.status,
        emailVerifiedAt: users.emailVerifiedAt,
        firstName: usersProfiles.firstName,
        lastName: usersProfiles.lastName,
        avatarUrl: usersProfiles.avatarUrl,
      })
      .from(users)
      .leftJoin(usersProfiles, eq(usersProfiles.userId, users.id))
      .where(eq(users.id, userId))
      .limit(1);
    return row ?? null;
  }

  private async recordFailedAttempt(authId: string, nextCount: number) {
    const lockedUntil =
      nextCount >= LOCK_THRESHOLD
        ? new Date(Date.now() + LOCK_DURATION_MS)
        : null;
    await this.db
      .update(auth)
      .set({
        failedAttempts: nextCount,
        lockedUntil,
      })
      .where(eq(auth.id, authId));
  }
}
