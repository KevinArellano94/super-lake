import drizzleConnection from "../connection/drizzle.ts";
import followings from "../model/followings.ts";
const DB = drizzleConnection();
import { sql, eq, ne, gt, gte, like, ilike, and, count } from "drizzle-orm";


const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;

export const Query = {
    following: async (_parent: unknown, args: { page: number, perPage: number, userId: string, createdAt: string }, ___: unknown) => {
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
    },
    followingCount: async (_parent: unknown, args: { userId: string }, ___: unknown) => {
        try {
            const { userId } = args;
            
            const followingCount = DB
                .select({ 
                    count: count() 
                })
                .from(followings)
                .where(eq(followings.user_id, userId))

            return await followingCount;
        } catch (error) {
            console.error('Error fetching followingCount:', error);
            throw new Error('Failed to fetch followingCount');
        }
    },
    followers: async (_parent: unknown, args: { page: number, perPage: number, userId: string, createdAt: string }, ___: unknown) => {
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
    },
    followersCount: async (_parent: unknown, args: { userId: string }, ___: unknown) => {
        try {
            const { userId } = args;
            
            const followersCount = DB
                .select({ 
                    count: count() 
                })
                .from(followings)
                .where(eq(followings.followed_id, userId))

            return await followersCount;
        } catch (error) {
            console.error('Error fetching followersCount:', error);
            throw new Error('Failed to fetch followersCount');
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
        } catch (error) {
            if (error.code === '23505') { // PostgreSQL unique violation code
                throw new Error('User already follows this account');
            }
            console.error('Error adding following:', error);
            throw new Error('Failed to add following');
        }
    },
    removeFollowing: async (_parent: unknown, { input }: any, ___: unknown) => {
        try {
            const deletedFollowings = await DB
                .delete(followings)
                .where(and(
                    eq(followings.user_id, input.user_id),
                    eq(followings.followed_id, input.followed_id)
                ))
                .returning();

            if (!deletedFollowings.length) {
                throw new Error('Following relationship not found');
            }

            return deletedFollowings;
        } catch (error) {
            console.error('Error removing following:', error);
            throw new Error('Failed to remove following');
        }
    }
};
