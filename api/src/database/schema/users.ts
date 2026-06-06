import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  status: text('status').notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  emailVerifiedAt: timestamp('email_verified_at', {
    precision: 0,
    mode: 'date',
  }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { precision: 0, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    precision: 0,
    mode: 'date',
  }).$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { precision: 0, mode: 'date' }),
});

export const auth = pgTable(
  'auth',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    provider: text('provider').notNull().default('local'),
    providerUserId: text('provider_user_id'),
    isPrimary: boolean('is_primary').notNull(),
    passwordHash: text('password_hash'),
    failedAttempts: integer('failed_attempts'),
    lockedUntil: timestamp('locked_until', { precision: 0, mode: 'date' }),
    lastUsedAt: timestamp('last_used_at', { precision: 0, mode: 'date' }),
    createdAt: timestamp('created_at', { precision: 0, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', {
      precision: 0,
      mode: 'date',
    }).$onUpdate(() => new Date()),
  },
  (t) => [index('auth_user_id_index').on(t.userId)],
);

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    authId: uuid('auth_id')
      .notNull()
      .references(() => auth.id),
    refreshTokenHash: text('refresh_token_hash').notNull(),
    expiresAt: timestamp('expires_at', {
      precision: 0,
      mode: 'date',
    }).notNull(),
    revokedAt: timestamp('revoked_at', { precision: 0, mode: 'date' }),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    deviceId: text('device_id'),
    createdAt: timestamp('created_at', { precision: 0, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('sessions_auth_id_index').on(t.authId)],
);

export const usersProfiles = pgTable('users_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phoneNumber: text('phone_number').unique(),
  bio: text('bio'),
  dateOfBirth: date('date_of_birth'),
  country: text('country'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { precision: 0, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 0, mode: 'date' }).$onUpdate(
    () => new Date(),
  ),
});

export const featureFlags = pgTable('feature_flags', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(),
  enabled: boolean('enabled').notNull().default(false),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  auths: many(auth),
  profile: one(usersProfiles, {
    fields: [users.id],
    references: [usersProfiles.userId],
  }),
}));

export const authRelations = relations(auth, ({ one, many }) => ({
  user: one(users, { fields: [auth.userId], references: [users.id] }),
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  auth: one(auth, { fields: [sessions.authId], references: [auth.id] }),
}));

export const usersProfilesRelations = relations(usersProfiles, ({ one }) => ({
  user: one(users, { fields: [usersProfiles.userId], references: [users.id] }),
}));
