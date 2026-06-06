# Media and Attachments

Tables in this slice:

- `media`
- `memories_media`

External dependencies:

- `memories_media.memory_id -> memories.id`

```sql
CREATE TABLE "media"(
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" BIGINT NULL,
    "mime_type" VARCHAR(255) NULL,
    "metadata" jsonb NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);
ALTER TABLE
    "media" ADD PRIMARY KEY("id");
CREATE INDEX "media_key_index" ON
    "media"("key");

CREATE TABLE "memories_media"(
    "id" UUID NOT NULL,
    "media_id" UUID NOT NULL,
    "memory_id" UUID NOT NULL
);
ALTER TABLE
    "memories_media" ADD PRIMARY KEY("id");
CREATE INDEX "memories_media_media_id_index" ON
    "memories_media"("media_id");
CREATE INDEX "memories_media_memory_id_index" ON
    "memories_media"("memory_id");

ALTER TABLE
    "memories_media" ADD CONSTRAINT "memories_media_memory_id_foreign" FOREIGN KEY("memory_id") REFERENCES "memories"("id");
ALTER TABLE
    "memories_media" ADD CONSTRAINT "memories_media_media_id_foreign" FOREIGN KEY("media_id") REFERENCES "media"("id");
```
