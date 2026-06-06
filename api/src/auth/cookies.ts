import type { Response } from 'express';
import { ACCESS_COOKIE, REFRESH_COOKIE } from './strategies/jwt.strategy';

type CookieOpts = {
  nodeEnv: string;
};

const baseOptions = (opts: CookieOpts) => ({
  httpOnly: true,
  secure: opts.nodeEnv === 'production',
  sameSite: 'lax' as const,
  path: '/api',
});

export function setAuthCookies(
  res: Response,
  tokens: {
    accessToken: string;
    refreshToken: string;
    accessTtlMs: number;
    refreshTtlMs: number;
  },
  opts: CookieOpts,
) {
  const base = baseOptions(opts);
  res.cookie(ACCESS_COOKIE, tokens.accessToken, {
    ...base,
    maxAge: tokens.accessTtlMs,
  });
  res.cookie(REFRESH_COOKIE, tokens.refreshToken, {
    ...base,
    maxAge: tokens.refreshTtlMs,
  });
}

export function clearAuthCookies(res: Response, opts: CookieOpts) {
  const base = baseOptions(opts);
  res.clearCookie(ACCESS_COOKIE, base);
  res.clearCookie(REFRESH_COOKIE, base);
}
