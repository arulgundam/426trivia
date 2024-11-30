import { db } from './db.mjs';

async function initialize() {
    await db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                points INTEGER NOT NULL,
                password TEXT NOT NULL,
            );
        `);

    console.log("Database setup complete");

    await db.close();
}

initialize();