# Memories Core

Tables in this slice:

- `memories`

External dependencies:

- `memories.user_id -> users.id`
- `memories.pod_id -> pods.id`

```sql
CREATE TABLE "memories"(
    "id" UUID NOT NULL,
    "pod_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NULL,
    "description" TEXT NULL,
    "location" TEXT NULL,
    "event_date" DATE NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "memories" ADD PRIMARY KEY("id");

ALTER TABLE
    "memories" ADD CONSTRAINT "memories_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "memories" ADD CONSTRAINT "memories_pod_id_foreign" FOREIGN KEY("pod_id") REFERENCES "pods"("id");
```
