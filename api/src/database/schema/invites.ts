import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { pods } from './pods';
import { users } from './users';

export const podInvites = pgTable(
  'pod_invites',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    token: text('token').notNull().unique(),
    podId: uuid('pod_id')
      .notNull()
      .references(() => pods.id, { onDelete: 'cascade' }),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),
    email: text('email'),
    expiresAt: timestamp('expires_at', {
      precision: 0,
      mode: 'date',
    }).notNull(),
    redeemedAt: timestamp('redeemed_at', { precision: 0, mode: 'date' }),
    redeemedBy: uuid('redeemed_by').references(() => users.id),
    revokedAt: timestamp('revoked_at', { precision: 0, mode: 'date' }),
    createdAt: timestamp('created_at', { precision: 0, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('pod_invites_pod_id_index').on(t.podId)],
);

export const podInvitesRelations = relations(podInvites, ({ one }) => ({
  pod: one(pods, { fields: [podInvites.podId], references: [pods.id] }),
  creator: one(users, {
    fields: [podInvites.createdBy],
    references: [users.id],
  }),
  redeemer: one(users, {
    fields: [podInvites.redeemedBy],
    references: [users.id],
  }),
}));
