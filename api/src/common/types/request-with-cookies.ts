import type { Request } from 'express';

export type RequestWithCookies = Request & {
  cookies?: Record<string, string>;
};

export const getCookie = (req: Request, name: string): string | undefined =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  (req as RequestWithCookies).cookies?.[name];
