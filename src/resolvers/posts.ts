import drizzleConnection from "../connection/drizzle.ts";
import posts from "../model/posts.ts";
const DB = drizzleConnection();
import { sql, eq, ne, gt, gte, like, ilike } from "drizzle-orm";


const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;

export const Query = {
    posts: async (_parent: unknown, args: { page: number, perPage: number, title: string, createdAt: string }, ___: unknown) => {
        try {
            const { page = DEFAULT_PAGE, perPage = DEFAULT_PER_PAGE, title, createdAt } = args;
            const offset = (page - 1) * perPage;

            const query = DB
                .select()
                .from(posts)
                .offset(offset)
                .limit(perPage);

            if (title) {
                query.where(ilike(posts.title, title));
            }

            if (createdAt) {
                query.where(sql`created_at::text ILIKE ${ createdAt }`);
            }

            return await query;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw new Error('Failed to fetch posts');
        }
    }
};

export const Mutation = {
    addPost: async (_parent: unknown, { input }: any, ___: unknown) => {
        try {
            return await DB
                .insert(posts)
                .values(input)
                .returning();
        } catch (error) {
            console.error('Error adding post:', error);
            throw new Error('Failed to add post');
        }
    }
};
