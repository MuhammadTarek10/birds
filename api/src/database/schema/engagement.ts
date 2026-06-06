import { relations } from 'drizzle-orm';
import {
  AnyPgColumn,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { memories } from './memories';
import { pods } from './pods';
import { users } from './users';

export const comments = pgTable(
  'comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    content: text('content'),
    parentCommentId: uuid('parent_comment_id').references(
      (): AnyPgColumn => comments.id,
    ),
    memoryId: uuid('memory_id')
      .notNull()
      .references(() => memories.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at', { precision: 0, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', {
      precision: 0,
      mode: 'date',
    }).$onUpdate(() => new Date()),
  },
  (t) => [
    index('comments_memory_id_index').on(t.memoryId),
    index('comments_user_id_index').on(t.userId),
  ],
);

export const tags = pgTable(
  'tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    podId: uuid('pod_id')
      .notNull()
      .references(() => pods.id),
    name: varchar('name', { length: 255 }).notNull().unique(),
    createdAt: timestamp('created_at', { precision: 0, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', {
      precision: 0,
      mode: 'date',
    }).$onUpdate(() => new Date()),
  },
  (t) => [index('tags_pod_id_index').on(t.podId)],
);

export const memoriesTags = pgTable(
  'memories_tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    memoryId: uuid('memory_id')
      .notNull()
      .references(() => memories.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id),
  },
  (t) => [
    index('memories_tags_memory_id_index').on(t.memoryId),
    index('memories_tags_tag_id_index').on(t.tagId),
  ],
);

export const commentsRelations = relations(comments, ({ one, many }) => ({
  memory: one(memories, {
    fields: [comments.memoryId],
    references: [memories.id],
  }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  parent: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
    relationName: 'commentThread',
  }),
  replies: many(comments, { relationName: 'commentThread' }),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  pod: one(pods, { fields: [tags.podId], references: [pods.id] }),
  memoryLinks: many(memoriesTags),
}));

export const memoriesTagsRelations = relations(memoriesTags, ({ one }) => ({
  memory: one(memories, {
    fields: [memoriesTags.memoryId],
    references: [memories.id],
  }),
  tag: one(tags, { fields: [memoriesTags.tagId], references: [tags.id] }),
}));
