import { relations } from 'drizzle-orm';
import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const pods = pgTable('pods', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  createdAt: timestamp('created_at', { precision: 0, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 0, mode: 'date' }).$onUpdate(
    () => new Date(),
  ),
});

export const podMembers = pgTable(
  'pod_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    podId: uuid('pod_id')
      .notNull()
      .references(() => pods.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    role: varchar('role', { length: 255 }).notNull(),
    joinedAt: timestamp('joined_at', { precision: 0, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('pod_members_pod_id_index').on(t.podId)],
);

export const podsRelations = relations(pods, ({ many }) => ({
  members: many(podMembers),
}));

export const podMembersRelations = relations(podMembers, ({ one }) => ({
  pod: one(pods, { fields: [podMembers.podId], references: [pods.id] }),
  user: one(users, { fields: [podMembers.userId], references: [users.id] }),
}));
