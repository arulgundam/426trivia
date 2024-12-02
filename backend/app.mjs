import express from 'express';
import cors from 'cors';
import { db } from './db.mjs';

const app = express();

const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is up and running!');
  });


app.post('/register', async (req, res) => {
    const { 
        username, 
        password 
    } = req.body;

    if (!username || !password) {
        return res.status(400).send({ error: "Username and password are required." });
    }

    try {
        const query = "INSERT INTO users (username, password, points) VALUES (?, ?, 0)";
        await db.run(query, [username, password]);
        res.status(201).send({ message: "User registered successfully." });
    } catch (error) {
        res.status(500).send({ error: "An error occurred during registration." });
    }
});

app.put('/update-score', async (req, res) => {
    let username = req.body.username;
    let points = req.body.points;

    if (!username || points === undefined) {
        return res.status(400).send({error: "username and points required."})
    }

    let node = await db.get("SELECT username FROM users WHERE username = ?", [username]);

    if (!node) {
        return res.status(400).send("Player does not exiset")
    }

    await db.run("UPDATE users SET points = ? WHERE usename = ?", [points, username]);
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

app.delete('/username', async (req, res) => {
    let username = req.body.username;

    if (!username) {
        return res.status(400).send("Username does not exist.");
    }

    let node = await db.get("SELECT username FROM users WHERE username = ?", [username]);

    if (!node) {
        return res.status(400).send("Player does not exist.")
    }

    await db.run("DELETE FROM users WHERE username = ?", [username]);
    return res.status(200).send("User deleted successfully.");
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})