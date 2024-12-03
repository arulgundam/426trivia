import express from 'express';
import cors from 'cors';
import { db } from './db.mjs';

const app = express();

const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/login', async (req, res) => {
    const { username, password } = req.query; // Extract from query parameters

    console.log("Username: " + username);
    console.log("Pass: " + password);

    if (!username || !password) {
        return res.status(400).send({ error: "Username and password are required." });
    }

    try {
        const user = await db.get(
            "SELECT username, password FROM users WHERE username = ? AND password = ?", 
            [username, password]
        );

        if (!user) {
            return res.status(404).send({ error: "Invalid username or password." });
        }

        return res.status(200).send({ user: { username: user.username } });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send({ error: "An error occurred while processing the login." });
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ error: "Username and password are required." });
    }

    try {
        const query = "INSERT INTO users (username, password, points) VALUES (?, ?, 0)";
        await db.run(query, [username, password]);
        res.status(201).send({ message: "User registered successfully." });
    } catch (error) {
        if (error.message.includes("UNIQUE constraint failed")) {
            return res.status(400).send({ error: "An account with this username already exists." });
        }
        console.error("Error during registration:", error);
        res.status(500).send({ error: "An error occurred during registration." });
    }
});


app.put('/update-score', async (req, res) => {
    let username = req.body.username;
    let points = req.body.points;

    if (!username || points === undefined) {
        return res.status(400).send({error: "username and points required."});
    }

    try {
        const user = await db.get("SELECT username FROM users WHERE username = ?", [username]);

        if (!user) {
            return res.status(404).send({ error: "Player does not exist." });
        }

        await db.run("UPDATE users SET points = ? WHERE username = ?", [points, username]);

        return res.status(200).send({ message: "Score updated successfully." });
    } catch (error) {
        return res.status(500).send({ error: "An error occurred while updating the score." });
    }

});

app.get('/points/:username', async (req, res) => {
    let username = req.params.username;

    if (!username) {
        return res.status(400).send("Username does not exist.");
    }

    let node = await db.get("SELECT points FROM users WHERE username = ?", [username]);

    if (!node) {
        return res.status(400).send("Player does not exist")
    }

    return res.json({ points: node.points });
});

app.delete('/username/:username', async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).send("Username does not exist.");
    }

    try {
        const node = await db.get("SELECT username FROM users WHERE username = ?", [username]);

        if (!node) {
            return res.status(404).send("Player does not exist.");
        }

        await db.run("DELETE FROM users WHERE username = ?", [username]);
        return res.status(200).send("User deleted successfully.");
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).send("An error occurred while deleting the user.");
    }
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})