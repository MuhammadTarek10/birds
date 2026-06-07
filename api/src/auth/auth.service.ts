import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IssueSessionResult } from './dto/issue-session.input';
import { TokenService } from './services/token.service';
import { UserAuthService, type AuthedUser } from './services/user-auth.service';
import type { SessionContext } from './types';

export type RefreshOutcome = {
  user: AuthedUser;
  tokens: IssueSessionResult;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userAuth: UserAuthService,
    private readonly tokens: TokenService,
  ) {}

  issue(user: AuthedUser, ctx: SessionContext): Promise<IssueSessionResult> {
    return this.tokens.issueSession({
      userId: user.userId,
      authId: user.authId,
      role: user.role,
      email: user.email,
      ctx,
    });
  }

  async refresh(
    rawRefreshToken: string | undefined,
    ctx: SessionContext,
  ): Promise<RefreshOutcome> {
    if (!rawRefreshToken)
      throw new UnauthorizedException('Missing refresh token');

    const payload = await this.tokens.verifyRefresh(rawRefreshToken);
    const { authId } = await this.tokens.assertSessionActive(payload.sessionId);
    const user = await this.userAuth.loadByAuthId(authId);
    if (!user) throw new UnauthorizedException('Unknown user');

    await this.tokens.revokeSession(payload.sessionId);
    const tokens = await this.issue(user, ctx);
    return { user, tokens };
  }

  async logout(sessionId: string | undefined): Promise<void> {
    if (sessionId) await this.tokens.revokeSession(sessionId);
  }
}
