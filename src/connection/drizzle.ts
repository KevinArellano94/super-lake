import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import users from "../model/users.ts";


function drizzleConnection() {
    const sql = neon('postgresql:the-database-url');
    const db = drizzle({ client: sql });

    return db;
}

export default drizzleConnection;