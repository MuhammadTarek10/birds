import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { CONFIG } from '../../config/config.constants';
import {
  IssueSessionInput,
  IssueSessionResult,
} from '../dto/issue-session.input';
import { SessionsRepository } from '../repositories/sessions.repository';
import type { AccessPayload, RefreshPayload } from '../types';

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

@Injectable()
export class TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessTtlMs: number;
  private readonly refreshTtlMs: number;

  constructor(
    private readonly sessions: SessionsRepository,
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    this.accessSecret = config.getOrThrow<string>(CONFIG.jwt.accessSecret);
    this.refreshSecret = config.getOrThrow<string>(CONFIG.jwt.refreshSecret);
    this.accessTtlMs = config.getOrThrow<number>(CONFIG.jwt.accessTtlMs);
    this.refreshTtlMs = config.getOrThrow<number>(CONFIG.jwt.refreshTtlMs);
  }

  async issueSession(input: IssueSessionInput): Promise<IssueSessionResult> {
    const rawRefresh = randomBytes(48).toString('base64url');
    const refreshHash = sha256(rawRefresh);
    const expiresAt = new Date(Date.now() + this.refreshTtlMs);

    const sessionId = await this.sessions.insertActive({
      authId: input.authId,
      refreshTokenHash: refreshHash,
      expiresAt,
      ipAddress: input.ctx?.ipAddress,
      userAgent: input.ctx?.userAgent,
      deviceId: input.ctx?.deviceId,
    });

    const accessPayload: AccessPayload = {
      userId: input.userId,
      authId: input.authId,
      sessionId,
      role: input.role,
    };
    const refreshPayload: RefreshPayload = { userId: input.userId, sessionId };

    const accessToken = await this.jwt.signAsync(accessPayload, {
      secret: this.accessSecret,
      expiresIn: this.accessTtlMs / 1000,
    });
    const refreshToken = await this.jwt.signAsync(refreshPayload, {
      secret: this.refreshSecret,
      expiresIn: this.refreshTtlMs / 1000,
    });

    return {
      accessToken,
      refreshToken,
      sessionId,
      accessTtlMs: this.accessTtlMs,
      refreshTtlMs: this.refreshTtlMs,
    };
  }

  async verifyRefresh(token: string): Promise<RefreshPayload> {
    try {
      return await this.jwt.verifyAsync<RefreshPayload>(token, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async assertSessionActive(sessionId: string): Promise<{ authId: string }> {
    const row = await this.sessions.findActive(sessionId);
    if (!row) throw new UnauthorizedException('Session revoked');
    if (row.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Session expired');
    }
    return { authId: row.authId };
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.sessions.revoke(sessionId);
  }
}
