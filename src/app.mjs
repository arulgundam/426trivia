import express from 'express';
import bodyParser from 'body-parser';
import { db } from './db.mjs';

const app = express();

const port = 3000;

app.use(bodyParser.json());

connectDB(); //do we need this?

app.post('/register', async (req, res) => {
    const { 
        username, 
        password 
    } = req.body;

  if (!username || !password) {
    return res.status(400).send({ error: "Username and password are required." });
  }

  try {
    const newUser = new User({ username, password });
    await newUser.save();
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({ error: "Username already exists." });
    }
  }

});

app.put('/update-score', async (req, res) => {
    const { username, points } = req.body;

    if (!username || points === undefined) {
        return res.status(400).send({error: "username and points required."})
    }
});

app.get('/points/:username', async (req, res) => {
    let username = req.params.username;

    if (!username) {
        return res.status(400).send("Username does not exist.");
    }

    let node = await db.get("SELECT points FROM users WHERE username = ?", [username]);

    if (!node) {
        return res.status(400).send("Player does not have any points yet.")
    }

    return res.send(node.points);
});
app.listen(port, () => {
    console.log('Running...');
})