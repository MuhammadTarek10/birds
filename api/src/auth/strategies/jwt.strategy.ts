import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getCookie } from '../../common/types/request-with-cookies';
import { CONFIG } from '../../config/config.constants';
import type { AccessPayload, CurrentUserPayload } from '../types';

export const ACCESS_COOKIE = 'mv_access';
export const REFRESH_COOKIE = 'mv_refresh';

const fromCookie =
  (cookieName: string) =>
  (req: Request): string | null =>
    getCookie(req, cookieName) ?? null;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        fromCookie(ACCESS_COOKIE),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>(CONFIG.jwt.accessSecret),
    });
  }

  validate(payload: AccessPayload): CurrentUserPayload {
    return {
      userId: payload.userId,
      authId: payload.authId,
      sessionId: payload.sessionId,
      role: payload.role,
      email: payload.email,
    };
  }
}
