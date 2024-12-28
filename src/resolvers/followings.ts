import drizzleConnection from "../connection/drizzle.ts";
import followings from "../model/followings.ts";
const DB = drizzleConnection();
import { sql, eq, ne, gt, gte, like, ilike } from "drizzle-orm";


const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;

export const Query = {
    followings: async (_parent: unknown, args: { page: number, perPage: number, userId: string, createdAt: string }, ___: unknown) => {
        try {
            const { page = DEFAULT_PAGE, perPage = DEFAULT_PER_PAGE, userId, createdAt } = args;
            const offset = (page - 1) * perPage;

            const query = DB
                .select()
                .from(followings)
                .offset(offset)
                .limit(perPage);

            if (userId) {
                query.where(ilike(followings.user_id, userId));
            }

            if (createdAt) {
                query.where(sql`created_at::text ILIKE ${ createdAt }`);
            }

            return await query;
        } catch (error) {
            console.error('Error fetching followings:', error);
            throw new Error('Failed to fetch followings');
        }
    }
};

export const Mutation = {
    addFollowing: async (_parent: unknown, { input }: any, ___: unknown) => {
        try {
            return await DB
                .insert(followings)
                .values(input)
                .returning();
                // .onConflictDoNothing({
                //     target: [followings.user_id, followings.following_id]
                // });
        } catch (error) {
            if (error.code === '23505') { // PostgreSQL unique violation code
                throw new Error('User already follows this account');
            }
            console.error('Error adding following:', error);
            throw new Error('Failed to add following');
        }
    }
};
