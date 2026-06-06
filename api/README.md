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

## Roadmap

Current milestone: **Foundation** (schema, config, migrations, health).

Next milestones (in order):

1. Auth — email/password + Google OAuth, JWT access + refresh against `sessions`.
2. Pods + membership + invite codes.
3. Memories CRUD with feed + calendar queries.
4. Media — R2 presigned URLs + `memories_media` linking.
5. Engagement — comments and tags endpoints.
