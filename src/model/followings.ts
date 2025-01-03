import { pgTable, text, timestamp, uuid, uniqueIndex } from 'drizzle-orm/pg-core';


const followings = pgTable('followings', {
    following_id: uuid('following_id').primaryKey().notNull(),
    followed_id: uuid('followed_id').notNull(),
    user_id: uuid('user_id').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
});

export default followings;