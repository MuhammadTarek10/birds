import type { Request } from 'express';

export type PodContext = {
  podId: string;
  role: string;
};

export type RequestWithPod = Request & {
  podContext?: PodContext;
};

export const getPodContext = (req: Request): PodContext | undefined =>
  (req as RequestWithPod).podContext;

export const setPodContext = (req: Request, ctx: PodContext): void => {
  (req as RequestWithPod).podContext = ctx;
};
