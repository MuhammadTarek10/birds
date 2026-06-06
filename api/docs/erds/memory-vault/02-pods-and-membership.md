# Pods and Membership

Tables in this slice:

- `pods`
- `pod_members`

External dependencies:

- `pod_members.user_id -> users.id`

```sql
CREATE TABLE "pods"(
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);
ALTER TABLE
    "pods" ADD PRIMARY KEY("id");
ALTER TABLE
    "pods" ADD CONSTRAINT "pods_code_unique" UNIQUE("code");

CREATE TABLE "pod_members"(
    "id" UUID NOT NULL,
    "pod_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "joined_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "pod_members" ADD PRIMARY KEY("id");
CREATE INDEX "pod_members_pod_id_index" ON
    "pod_members"("pod_id");

ALTER TABLE
    "pod_members" ADD CONSTRAINT "pod_members_pod_id_foreign" FOREIGN KEY("pod_id") REFERENCES "pods"("id");
ALTER TABLE
    "pod_members" ADD CONSTRAINT "pod_members_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
```
