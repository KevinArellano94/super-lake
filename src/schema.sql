CREATE TABLE users (
    -- id SERIAL PRIMARY KEY,
    -- user_id UUID DEFAULT gen_random_uuid('uuid_generate_v4()') NOT NULL,
    user_id UUID DEFAULT uuid_in((md5((random())::text))::cstring) PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE posts (
    post_id UUID DEFAULT uuid_in((md5((random())::text))::cstring) PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT,
    content TEXT,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE followings (
    following_id UUID DEFAULT uuid_in((md5((random())::text))::cstring) PRIMARY KEY,
    followed_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    -- Prevent duplicate likes from the same user
    CONSTRAINT unique_follow UNIQUE(user_id, followed_id),
    -- Prevent self-follows
    CONSTRAINT prevent_self_follow CHECK (user_id != followed_id)
);

CREATE TABLE likes (
    like_id UUID DEFAULT uuid_in((md5((random())::text))::cstring) PRIMARY KEY,
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
     -- Prevent duplicate likes from the same user
    UNIQUE(post_id, user_id)
);
