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
    user_id UUID DEFAULT uuid_in((md5((random())::text))::cstring),
    title TEXT,
    content TEXT,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE followings (
    following_id UUID DEFAULT uuid_in((md5((random())::text))::cstring) PRIMARY KEY,
    user_id UUID DEFAULT uuid_in((md5((random())::text))::cstring),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX unique_following 
ON followings (user_id, following_id);