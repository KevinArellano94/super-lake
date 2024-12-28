import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';


const users = pgTable('users', {
    // id: serial('id').primaryKey(),
    // uuid UUID DEFAULT uuid_in((md5((random())::text))::cstring),
    user_id: uuid('user_id').default('uuid_generate_v5()').primaryKey(),
    username: text('username').notNull(),
    display_name: text('display_name'),
    bio: text('bio'),
    location: text('location'),
    website: text('website'),
    profile_image_url: text('profile_image_url'),
    created_at: timestamp('created_at').notNull().defaultNow(),
});

export default users;