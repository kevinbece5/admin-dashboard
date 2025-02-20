import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial,
  varchar,
  boolean
} from 'drizzle-orm/pg-core';
import { count, eq, ilike } from 'drizzle-orm';

export const db = drizzle(neon(process.env.POSTGRES_URL!));
export type SelectCustomer = typeof users.$inferSelect;

export const statusEnum = pgEnum('status', ['active', 'inactive', 'archived']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: varchar('password').notNull(),
  isAdmin: boolean('is_admin').notNull()
});

export async function insertUser(password: string, username: string) {
  await db.insert(users).values({
    password,
    name: username,
    email: username,
    isAdmin: false
  });
}

export async function getCustomers() {
  return await db.select().from(users).where(eq(users.isAdmin, false));
}

export async function findUserByEmail(email: string) {
  const user = await db.select().from(users).where(eq(users.email, email));
  return user;
}
