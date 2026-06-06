import { relations } from 'drizzle-orm';
import {
  bigint,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { memories } from './memories';

export const media = pgTable(
  'media',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    key: text('key').notNull(),
    url: text('url').notNull(),
    name: text('name').notNull(),
    size: bigint('size', { mode: 'number' }),
    mimeType: varchar('mime_type', { length: 255 }),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { precision: 0, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', {
      precision: 0,
      mode: 'date',
    }).$onUpdate(() => new Date()),
  },
  (t) => [index('media_key_index').on(t.key)],
);

export const memoriesMedia = pgTable(
  'memories_media',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    mediaId: uuid('media_id')
      .notNull()
      .references(() => media.id),
    memoryId: uuid('memory_id')
      .notNull()
      .references(() => memories.id, { onDelete: 'cascade' }),
  },
  (t) => [
    index('memories_media_media_id_index').on(t.mediaId),
    index('memories_media_memory_id_index').on(t.memoryId),
  ],
);

export const mediaRelations = relations(media, ({ many }) => ({
  memoryLinks: many(memoriesMedia),
}));

export const memoriesMediaRelations = relations(memoriesMedia, ({ one }) => ({
  media: one(media, {
    fields: [memoriesMedia.mediaId],
    references: [media.id],
  }),
  memory: one(memories, {
    fields: [memoriesMedia.memoryId],
    references: [memories.id],
  }),
}));
