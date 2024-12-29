import { pgTable, text, integer, timestamp, uuid } from 'drizzle-orm/pg-core';


const likes = pgTable('likes', {
    like_id: uuid('like_id').default('uuid_generate_v5()').primaryKey(),
    post_id: uuid('post_id').notNull(),
    user_id: uuid('user_id').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
});

export default likes;