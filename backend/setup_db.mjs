import { db } from './db.mjs';

async function initialize() {
    await db.run(`DROP TABLE IF EXISTS users`);
    
    await db.run(`
            CREATE TABLE IF NOT EXISTS users (
                username TEXT UNIQUE NOT NULL PRIMARY KEY,
                points INTEGER NOT NULL,
                password TEXT NOT NULL
            );
        `);

    console.log("Database setup complete");

    await db.close();
}

initialize();