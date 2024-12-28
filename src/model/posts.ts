import { pgTable, text, integer, timestamp, uuid } from 'drizzle-orm/pg-core';


const posts = pgTable('posts', {
    post_id: uuid('post_id').default('uuid_generate_v5()').primaryKey(),
    user_id: uuid('user_id').references(() => users.id),
    title: text('title'),
    content: text('content'),
    likes: integer('likes').default(0),
    created_at: timestamp('created_at').notNull().defaultNow(),
});

export default posts;