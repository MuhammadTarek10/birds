import { relations } from 'drizzle-orm';
import {
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { pods } from './pods';
import { users } from './users';

export const memories = pgTable(
  'memories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    podId: uuid('pod_id')
      .notNull()
      .references(() => pods.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    title: text('title').notNull(),
    description: text('description'),
    location: text('location'),
    eventDate: date('event_date').notNull(),
    createdAt: timestamp('created_at', { precision: 0, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', {
      precision: 0,
      mode: 'date',
    }).$onUpdate(() => new Date()),
  },
  (t) => [
    index('memories_pod_event_date_id_idx').on(
      t.podId,
      t.eventDate.desc(),
      t.id.desc(),
    ),
  ],
);

export const memoriesRelations = relations(memories, ({ one }) => ({
  pod: one(pods, { fields: [memories.podId], references: [pods.id] }),
  author: one(users, { fields: [memories.userId], references: [users.id] }),
}));
