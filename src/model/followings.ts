import { pgTable, text, timestamp, uuid, uniqueIndex } from 'drizzle-orm/pg-core';


const followings = pgTable('followings', {
    following_id: uuid('following_id').notNull(),
    user_id: uuid('user_id').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
    pk: primaryKey(table.user_id, table.following_id),
    uniqueFollowing: uniqueIndex('unique_following').on(table.user_id, table.following_id)
}));

export default followings;