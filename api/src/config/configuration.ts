import { DEFAULTS, ENV_KEYS } from './config.constants';

const num = (key: string, fallback?: number) => {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return fallback;
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? fallback : n;
};

export const configuration = () => ({
  app: {
    nodeEnv: process.env[ENV_KEYS.NODE_ENV] ?? 'development',
    port: num(ENV_KEYS.PORT, DEFAULTS.PORT),
    appUrl: process.env[ENV_KEYS.APP_URL] ?? DEFAULTS.APP_URL,
    webOrigin: process.env[ENV_KEYS.WEB_ORIGIN] ?? DEFAULTS.WEB_ORIGIN,
  },
  db: {
    url: process.env[ENV_KEYS.DATABASE_URL]!,
  },
  jwt: {
    accessSecret: process.env[ENV_KEYS.JWT_ACCESS_SECRET]!,
    refreshSecret: process.env[ENV_KEYS.JWT_REFRESH_SECRET]!,
    accessTtlMs: num(ENV_KEYS.JWT_ACCESS_TTL_MS, DEFAULTS.JWT_ACCESS_TTL_MS),
    refreshTtlMs: num(ENV_KEYS.JWT_REFRESH_TTL_MS, DEFAULTS.JWT_REFRESH_TTL_MS),
  },
  google: {
    clientId: process.env[ENV_KEYS.GOOGLE_OAUTH_CLIENT_ID] ?? '',
    clientSecret: process.env[ENV_KEYS.GOOGLE_OAUTH_CLIENT_SECRET] ?? '',
    redirectUri: process.env[ENV_KEYS.GOOGLE_OAUTH_REDIRECT_URI] ?? '',
  },
  r2: {
    accountId: process.env[ENV_KEYS.R2_ACCOUNT_ID] ?? '',
    accessKeyId: process.env[ENV_KEYS.R2_ACCESS_KEY_ID] ?? '',
    secretAccessKey: process.env[ENV_KEYS.R2_SECRET_ACCESS_KEY] ?? '',
    bucket: process.env[ENV_KEYS.R2_BUCKET] ?? '',
    publicBaseUrl: process.env[ENV_KEYS.R2_PUBLIC_BASE_URL] ?? '',
  },
});
