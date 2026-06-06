# Memory Vault API

NestJS + PostgreSQL + Drizzle ORM backend for Memory Vault.

See `docs/erds/memory-vault/` for the data model and `../docs/prds/memory-vault.md` for product context.

## Stack

- **Runtime**: Node.js 20+, NestJS 11
- **Database**: PostgreSQL, accessed via Drizzle ORM (`drizzle-orm/node-postgres`)
- **Migrations**: `drizzle-kit` → SQL files in `./drizzle`
- **Storage** (later milestone): Cloudflare R2 via presigned URLs

## Setup

```bash
cp .env.example .env
# fill in DATABASE_URL and JWT_*_SECRET at minimum

npm install
```

Spin up a local Postgres if you don't have one:

```bash
docker run --rm -d --name mv-pg -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=memory_vault \
  postgres:16
```

## Database

```bash
npm run db:generate   # create a new SQL migration from schema changes
npm run db:migrate    # apply pending migrations
npm run db:studio     # open drizzle-kit studio (optional)
```

Schema source of truth: `src/database/schema/*.ts`.

## Run

```bash
npm run start:dev
```

Health check:

```bash
curl http://localhost:3000/api/health
```

## Auth

Token transport: httpOnly cookies `mv_access` + `mv_refresh`, `SameSite=Lax`, `Path=/api`. Frontend must send requests with `credentials: 'include'`.

| Method | Path                          | Auth     | Body                                       | Notes                                                          |
| ------ | ----------------------------- | -------- | ------------------------------------------ | -------------------------------------------------------------- |
| POST   | `/api/auth/register`          | public   | `{ email, password, firstName?, lastName?}` | Creates user + local auth, issues cookies.                     |
| POST   | `/api/auth/login`             | public   | `{ email, password }`                      | Locks account after 5 failures for 15 minutes.                 |
| POST   | `/api/auth/refresh`           | public   | —                                          | Rotates session, sets new cookies. Reads `mv_refresh` cookie.   |
| POST   | `/api/auth/logout`            | required | —                                          | Revokes current session, clears cookies.                       |
| GET    | `/api/auth/me`                | required | —                                          | Returns user + profile.                                         |
| GET    | `/api/auth/google`            | public   | —                                          | Redirects to Google OAuth.                                      |
| GET    | `/api/auth/google/callback`   | public   | —                                          | Issues cookies and redirects to `${WEB_ORIGIN}/auth/callback`. |

All other routes are protected by a global `JwtAuthGuard`; opt-out with `@Public()`.

## Roadmap

Completed: **Foundation** (schema, config, migrations, health) · **Auth** (local + Google + JWT/sessions).

Next milestones (in order):

1. Pods + membership + invite codes.
2. Memories CRUD with feed + calendar queries.
3. Media — R2 presigned URLs + `memories_media` linking.
4. Engagement — comments and tags endpoints.
