# Auth and Users

Tables in this slice:

- `users`
- `auth`
- `sessions`
- `users_profiles`
- `feature_flags`

```sql
CREATE TABLE "users"(
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "email_verified_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    "metadata" jsonb NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    "deleted_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
ALTER TABLE
    "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");

CREATE TABLE "auth"(
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'local',
    "provider_user_id" TEXT NULL,
    "is_primary" BOOLEAN NOT NULL,
    "password_hash" TEXT NULL,
    "failed_attempts" INTEGER NULL,
    "locked_until" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    "last_used_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);
ALTER TABLE
    "auth" ADD PRIMARY KEY("id");
CREATE INDEX "auth_user_id_index" ON
    "auth"("user_id");

CREATE TABLE "sessions"(
    "id" UUID NOT NULL,
    "auth_id" UUID NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "revoked_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    "ip_address" TEXT NULL,
    "user_agent" TEXT NULL,
    "device_id" TEXT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "sessions" ADD PRIMARY KEY("id");
CREATE INDEX "sessions_auth_id_index" ON
    "sessions"("auth_id");

CREATE TABLE "feature_flags"(
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT FALSE
);
ALTER TABLE
    "feature_flags" ADD PRIMARY KEY("id");
ALTER TABLE
    "feature_flags" ADD CONSTRAINT "feature_flags_key_unique" UNIQUE("key");

CREATE TABLE "users_profiles"(
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "first_name" TEXT NULL,
    "last_name" TEXT NULL,
    "phone_number" TEXT NULL,
    "bio" TEXT NULL,
    "date_of_birth" DATE NULL,
    "country" TEXT NULL,
    "avatar_url" TEXT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);
ALTER TABLE
    "users_profiles" ADD PRIMARY KEY("id");
ALTER TABLE
    "users_profiles" ADD CONSTRAINT "users_profiles_phone_number_unique" UNIQUE("phone_number");

ALTER TABLE
    "auth" ADD CONSTRAINT "auth_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "sessions" ADD CONSTRAINT "sessions_auth_id_foreign" FOREIGN KEY("auth_id") REFERENCES "auth"("id");
ALTER TABLE
    "users_profiles" ADD CONSTRAINT "users_profiles_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
```
