import drizzleConnection from "../connection/drizzle.ts";
import users from "../model/users.ts";
import posts from "../model/posts.ts";
import followings from "../model/followings.ts";
const DB = drizzleConnection();
import { sql, eq, ne, gt, gte, like, ilike, asc, desc, count } from "drizzle-orm";


const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;

export const Query = {
    user: async (_parent: unknown, { userId }: UserQueryArgs) => {
        try {
            const user = await DB
                .select()
                .from(users)
                .where(eq(users.user_id, userId))
                .limit(1)
                .then(rows => rows[0]);

            if (!user) {
                throw new GraphQLError("User not found", {
                    extensions: { code: "NOT_FOUND" }
                });
            }

            return user;
        } catch (error) {
            console.error("Error fetching user:", error);
            throw new GraphQLError("Failed to fetch user", {
                extensions: { code: "INTERNAL_SERVER_ERROR" }
            });
        }
    },
    users: async (_parent: unknown, args: { page: number, perPage: number, username: string, location: string, createdAt: string }, ___: unknown) => {
        try {
            const { page = DEFAULT_PAGE, perPage = DEFAULT_PER_PAGE, username, location, createdAt } = args;
            const offset = (page - 1) * perPage;

            const query = DB
                .select()
                .from(users)
                .offset(offset)
                .limit(perPage);

            if (username) {
                query.where(ilike(users.username, username));
            }

            if (location) {
                query.where(ilike(users.location, location));
            }

            if (createdAt) {
                query.where(sql`created_at::text ILIKE ${createdAt}`);
            }

            return await query;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to fetch users');
        }
    }
};

export const User = {
    posts: async (parent: { user_id: string }) => {
        try {
            const userPosts = await DB
                .select()
                .from(posts)
                .where(eq(posts.user_id, parent.user_id))
                .orderBy(desc(posts.created_at));

            return userPosts;
        } catch (error) {
            console.error("Error fetching user posts:", error);
            throw new GraphQLError("Failed to fetch user posts", {
                extensions: { code: "INTERNAL_SERVER_ERROR" }
            });
        }
    },
    following: async (parent: { user_id: string }) => {
        try {
            const userFollowing = await DB
                .select({
                    following_id: followings.following_id,
                    followed_id: followings.followed_id,
                    user_id: followings.user_id,
                    created_at: followings.created_at,
                    username: users.username,
                })
                .from(followings)
                .innerJoin(users, eq(users.user_id, followings.followed_id))
                .where(eq(followings.user_id, parent.user_id))
                .orderBy(desc(followings.created_at));

            return userFollowing;
        } catch (error) {
            console.error("Error fetching user following:", error);
            throw new GraphQLError("Failed to fetch user following", {
                extensions: { code: "INTERNAL_SERVER_ERROR" }
            });
        }
    },
    followingCount: async (parent: { user_id: string }) => {
        try {
            const followingCount = DB
                .select({ 
                    count: count() 
                })
                .from(followings)
                .where(eq(followings.user_id, parent.user_id))

            return await followingCount;
        } catch (error) {
            console.error('Error fetching followingCount:', error);
            throw new Error('Failed to fetch followingCount');
        }
    },
    followers: async (parent: { user_id: string }) => {
        try {
            const userFollowers = await DB
                .select({
                    following_id: followings.following_id,
                    followed_id: followings.followed_id,
                    user_id: followings.user_id,
                    created_at: followings.created_at,
                    username: users.username,
                })
                .from(followings)
                .innerJoin(users, eq(users.user_id, followings.user_id))
                .where(eq(followings.followed_id, parent.user_id))
                .orderBy(desc(followings.created_at));

            return userFollowers;
        } catch (error) {
            console.error("Error fetching user followers:", error);
            throw new GraphQLError("Failed to fetch user followers", {
                extensions: { code: "INTERNAL_SERVER_ERROR" }
            });
        }
    },
    followersCount: async (parent: { user_id: string }) => {
        try {
            const followersCount = DB
                .select({ 
                    count: count() 
                })
                .from(followings)
                .where(eq(followings.followed_id, parent.user_id))

            return await followersCount;
        } catch (error) {
            console.error('Error fetching followersCount:', error);
            throw new Error('Failed to fetch followersCount');
        }
    }
};

export const Mutation = {
    addUser: async (_parent: unknown, { input }: any, ___: unknown) => {
        try {
            return await DB
                .insert(users)
                .values(input)
                .returning();
        } catch (error) {
            console.error('Error adding user:', error);
            throw new Error('Failed to add user');
        }
    }
};
