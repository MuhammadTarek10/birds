# Engagement and Taxonomy

Tables in this slice:

- `comments`
- `tags`
- `memories_tags`

External dependencies:

- `comments.memory_id -> memories.id`
- `comments.user_id -> users.id`
- `tags.pod_id -> pods.id`
- `memories_tags.memory_id -> memories.id`

```sql
CREATE TABLE "comments"(
    "id" UUID NOT NULL,
    "content" TEXT NULL,
    "parent_comment_id" UUID NULL,
    "memory_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);
ALTER TABLE
    "comments" ADD PRIMARY KEY("id");
CREATE INDEX "comments_memory_id_index" ON
    "comments"("memory_id");
CREATE INDEX "comments_user_id_index" ON
    "comments"("user_id");

CREATE TABLE "tags"(
    "id" UUID NOT NULL,
    "pod_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);
ALTER TABLE
    "tags" ADD PRIMARY KEY("id");
CREATE INDEX "tags_pod_id_index" ON
    "tags"("pod_id");
ALTER TABLE
    "tags" ADD CONSTRAINT "tags_name_unique" UNIQUE("name");

CREATE TABLE "memories_tags"(
    "id" UUID NOT NULL,
    "memory_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL
);
ALTER TABLE
    "memories_tags" ADD PRIMARY KEY("id");
CREATE INDEX "memories_tags_memory_id_index" ON
    "memories_tags"("memory_id");
CREATE INDEX "memories_tags_tag_id_index" ON
    "memories_tags"("tag_id");

ALTER TABLE
    "comments" ADD CONSTRAINT "comments_parent_comment_id_foreign" FOREIGN KEY("parent_comment_id") REFERENCES "comments"("id");
ALTER TABLE
    "comments" ADD CONSTRAINT "comments_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "comments" ADD CONSTRAINT "comments_memory_id_foreign" FOREIGN KEY("memory_id") REFERENCES "memories"("id");
ALTER TABLE
    "tags" ADD CONSTRAINT "tags_pod_id_foreign" FOREIGN KEY("pod_id") REFERENCES "pods"("id");
ALTER TABLE
    "memories_tags" ADD CONSTRAINT "memories_tags_memory_id_foreign" FOREIGN KEY("memory_id") REFERENCES "memories"("id");
ALTER TABLE
    "memories_tags" ADD CONSTRAINT "memories_tags_tag_id_foreign" FOREIGN KEY("tag_id") REFERENCES "tags"("id");
```
