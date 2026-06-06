export const CONFIG = {
  app: {
    nodeEnv: 'app.nodeEnv',
    port: 'app.port',
    appUrl: 'app.appUrl',
    webOrigin: 'app.webOrigin',
    enableDocs: 'app.enableDocs',
  },
  db: {
    url: 'db.url',
  },
  jwt: {
    accessSecret: 'jwt.accessSecret',
    refreshSecret: 'jwt.refreshSecret',
    accessTtlMs: 'jwt.accessTtlMs',
    refreshTtlMs: 'jwt.refreshTtlMs',
  },
  google: {
    clientId: 'google.clientId',
    clientSecret: 'google.clientSecret',
    redirectUri: 'google.redirectUri',
  },
  r2: {
    accountId: 'r2.accountId',
    accessKeyId: 'r2.accessKeyId',
    secretAccessKey: 'r2.secretAccessKey',
    bucket: 'r2.bucket',
    publicBaseUrl: 'r2.publicBaseUrl',
  },
} as const;

export const ENV_KEYS = {
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  APP_URL: 'APP_URL',
  WEB_ORIGIN: 'WEB_ORIGIN',
  ENABLE_DOCS: 'ENABLE_DOCS',
  DATABASE_URL: 'DATABASE_URL',
  JWT_ACCESS_SECRET: 'JWT_ACCESS_SECRET',
  JWT_REFRESH_SECRET: 'JWT_REFRESH_SECRET',
  JWT_ACCESS_TTL_MS: 'JWT_ACCESS_TTL_MS',
  JWT_REFRESH_TTL_MS: 'JWT_REFRESH_TTL_MS',
  GOOGLE_OAUTH_CLIENT_ID: 'GOOGLE_OAUTH_CLIENT_ID',
  GOOGLE_OAUTH_CLIENT_SECRET: 'GOOGLE_OAUTH_CLIENT_SECRET',
  GOOGLE_OAUTH_REDIRECT_URI: 'GOOGLE_OAUTH_REDIRECT_URI',
  R2_ACCOUNT_ID: 'R2_ACCOUNT_ID',
  R2_ACCESS_KEY_ID: 'R2_ACCESS_KEY_ID',
  R2_SECRET_ACCESS_KEY: 'R2_SECRET_ACCESS_KEY',
  R2_BUCKET: 'R2_BUCKET',
  R2_PUBLIC_BASE_URL: 'R2_PUBLIC_BASE_URL',
} as const;

export const DEFAULTS = {
  PORT: 3000,
  APP_URL: 'http://localhost:3000',
  WEB_ORIGIN: 'http://localhost:5173',
  JWT_ACCESS_TTL_MS: 15 * 60_000,
  JWT_REFRESH_TTL_MS: 30 * 24 * 60 * 60_000,
} as const;
