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

## Pods

A pod is the tenant boundary — every memory, tag, comment, and media object lives inside one. The current user is identified via the global `JwtAuthGuard`; pod-scoped routes additionally use `PodMembershipGuard` (in `src/pods/guards/`) which resolves `:podId` from the path, checks `pod_members`, and attaches `PodContext` to the request. Handlers consume it via `@CurrentPod()`.

On registration, a pod is automatically created for the new user (named `${firstName}'s memories`, or `${emailLocalPart}'s memories` when no first name is supplied) **unless** the register call includes a valid `inviteToken`, in which case the user joins the inviting pod instead. Either path runs inside one transaction (see UoW below) so register + pod assignment are atomic.

| Method | Path                                  | Auth        | Body          | Notes                                                  |
| ------ | ------------------------------------- | ----------- | ------------- | ------------------------------------------------------ |
| POST   | `/api/pods`                           | user        | `{ name }`    | Creates pod; caller becomes `admin`.                   |
| GET    | `/api/pods`                           | user        | —             | Pods the caller belongs to (with role + memberCount). |
| GET    | `/api/pods/:podId`                    | pod member  | —             | Single pod view from the caller's perspective.         |
| PATCH  | `/api/pods/:podId`                    | pod admin   | `{ name }`    | Rename.                                                |
| GET    | `/api/pods/:podId/members`            | pod member  | —             | All members with their user summary.                   |
| PATCH  | `/api/pods/:podId/members/:userId`    | pod admin   | `{ role }`    | Promote / demote. Last admin protected (409).          |
| DELETE | `/api/pods/:podId/members/:userId`    | admin or self | —           | 204 on success. Last admin protected.                  |

`pods.code` is a 10-char nanoid over an unambiguous alphabet (`23456789ABCDEFGHJKLMNPQRSTUVWXYZ`) used as a stable display slug — **not** as a join token. To add members, use the Invites flow.

For new feature modules that need pod-scoped routes: import `PodMembershipGuard` (exported from `PodsModule`), apply via `@UseGuards(PodMembershipGuard)` on any handler with a `:podId` param, then read membership via `@CurrentPod()`.

## Invites

Pod admins issue single-use invite tokens. Tokens are 32-char base64url strings (192 bits of entropy). Each invite can optionally target a specific email — the redeemer's account email must match (case-insensitive). Default TTL is 7 days; configurable via `expiresInHours` (1..720) on create.

| Method | Path                                       | Auth      | Body                          | Notes                                                                      |
| ------ | ------------------------------------------ | --------- | ----------------------------- | -------------------------------------------------------------------------- |
| POST   | `/api/pods/:podId/invites`                 | pod admin | `{ email?, expiresInHours? }` | Creates an invite. Response includes `token` and a frontend `inviteUrl`.   |
| GET    | `/api/pods/:podId/invites`                 | pod admin | —                             | List all invites for the pod (active, redeemed, revoked, expired).         |
| DELETE | `/api/pods/:podId/invites/:inviteId`       | pod admin | —                             | Revoke a still-active invite. 204.                                          |
| GET    | `/api/invites/:token`                      | public    | —                             | Preview the pod name for an invite landing page. 410 if invalid.            |
| POST   | `/api/invites/redeem`                      | user      | `{ token }`                   | Redeem as the logged-in user (already-registered flow).                     |

Unregistered users include the token on `POST /api/auth/register { inviteToken }` to join the pod as part of signup. The invite URL is composed as `${WEB_ORIGIN}/invite/${token}` — server doesn't send email; the admin shares it manually for now.

### Repositories & Unit of Work

Services never touch Drizzle or `database/schema` directly. Each feature module owns its repositories under `src/<feature>/repositories/`, extending `BaseRepository` (in `src/database/base-repository.ts`). Repositories read their executor from `TransactionManager.current()` so the same code works inside and outside a transaction.

Multi-table writes are wrapped with the UoW:

```ts
await this.tm.run(async () => {
  const user = await this.users.insert(...);
  await this.profiles.insert({ userId: user.id, ... });
  await this.creds.insertLocal({ userId: user.id, passwordHash });
});
```

`tm.run` is reentrant — nesting reuses the outer transaction.

## API docs

Swagger UI is mounted at `/api/docs` when `ENABLE_DOCS=true` (default in dev, off in production). Behind the scenes:

- Spec is generated from `@nestjs/swagger` decorators on controllers + DTOs.
- All successful responses are wrapped by the global `ResponseInterceptor` (`src/common/interceptors/response.interceptor.ts`) into `{ data, message, status }` using `ResponseDto` (`src/common/dto/response.dto.ts`). Controllers return raw payloads; the interceptor handles the envelope.
- Per-handler messages come from `@ResponseMessage('…')` (`src/common/decorators/response-message.decorator.ts`). Default is `'Operation successful'`.
- Handlers that return `undefined`/`null` (e.g. `204 No Content`, redirect handlers using `@Res()`) are passed through unwrapped.
- Error responses follow the shape emitted by `HttpExceptionFilter` (`src/common/dto/error.response.ts`).

To regenerate the spec for the frontend repo:

```bash
npm run docs:generate   # writes docs/openapi.json
```

### Conventions for new controllers

1. `@ApiTags('Feature')` + `@ApiCookieAuth('cookie-auth')` on the controller. Public endpoints add `@ApiSecurity({})`.
2. Every handler gets `@ApiOperation` + `@ApiResponse({ status, type })` per documented status code.
3. Request DTOs: add `@ApiProperty` / `@ApiPropertyOptional` next to each `class-validator` rule.
4. Response payload DTOs live in `src/<feature>/dto/responses/<name>.response.ts`.
5. For each endpoint also create `<name>.envelope.ts` so `@ApiResponse({ type: SomeEnvelope })` carries the full `{ data, message, status }` shape (Swagger can't infer generics).
6. Controllers return the raw payload (e.g. `return { id, email, role }`) and use `@ResponseMessage('…')` for the message; the global `ResponseInterceptor` wraps it.

## Roadmap

Completed: **Foundation** (schema, config, migrations, health) · **Auth** (local + Google + JWT/sessions).

Next milestones (in order):

1. Pods + membership + invite codes.
2. Memories CRUD with feed + calendar queries.
3. Media — R2 presigned URLs + `memories_media` linking.
4. Engagement — comments and tags endpoints.
