ALTER TABLE "memories" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "memories_pod_event_date_id_idx" ON "memories" ("pod_id","event_date" DESC,"id" DESC);