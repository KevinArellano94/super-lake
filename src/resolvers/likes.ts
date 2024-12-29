import drizzleConnection from "../connection/drizzle.ts";
import likes from "../model/likes.ts";
import posts from "../model/posts.ts";
import users from "../model/users.ts";
const DB = drizzleConnection();
import { sql, eq, ne, gt, gte, like, ilike } from "drizzle-orm";


const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;

export const Query = {
    likes: async (_parent: unknown, args: { page: number, perPage: number, likedId: string, postId: string, userId: string, createdAt: string }, ___: unknown) => {
        try {
            const { page = DEFAULT_PAGE, perPage = DEFAULT_PER_PAGE, likedId, postId, userId, createdAt } = args;
            const offset = (page - 1) * perPage;

            const query = DB
                .select()
                .from(likes)
                .offset(offset)
                .limit(perPage);

            if (likedId) {
                query.where(ilike(likes.post_id, likedId));
            }

            if (createdAt) {
                query.where(sql`created_at::text ILIKE ${createdAt}`);
            }

            return await query;
        } catch (error) {
            console.error('Error fetching likes:', error);
            throw new Error('Failed to fetch likes');
        }
    }
};

export const Mutation = {
    addLike: async (_parent: unknown, { input }: any, ___: unknown) => {
        try {
            const getUser = await DB
                .select()
                .from(users)
                .where(eq(users.user_id, input.user_id));

            if (!getUser.length) {
                throw new Error('User not found');
            }

            const updatePostLikeCount = await DB
                .update(posts)
                .set({
                    likes: sql`${posts.likes} + 1`,
                })
                .where(eq(posts.post_id, input.post_id))
                .returning();

            if (!updatePostLikeCount.length) {
                throw new Error('Post not found');
            }

            return await DB
                .insert(likes)
                .values(input)
                .returning();
        } catch (error) {
            console.error('Error adding like:', error);
            throw new Error('Failed to add like');
        }
    }
};
