CREATE TABLE "pod_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"pod_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"email" text,
	"expires_at" timestamp (0) NOT NULL,
	"redeemed_at" timestamp (0),
	"redeemed_by" uuid,
	"revoked_at" timestamp (0),
	"created_at" timestamp (0) DEFAULT now() NOT NULL,
	CONSTRAINT "pod_invites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "pod_invites" ADD CONSTRAINT "pod_invites_pod_id_pods_id_fk" FOREIGN KEY ("pod_id") REFERENCES "public"."pods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pod_invites" ADD CONSTRAINT "pod_invites_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pod_invites" ADD CONSTRAINT "pod_invites_redeemed_by_users_id_fk" FOREIGN KEY ("redeemed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pod_invites_pod_id_index" ON "pod_invites" USING btree ("pod_id");