import express from 'express';
import bodyParser from 'body-parser';
import { db } from './db.mjs';

const app = express();

const port = 3000;

app.use(bodyParser.json());

connectDB();

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

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

app.post('/nodes', async (req, res) => {
});

app.put('/nodes/:id', async (req, res) => {
});

app.get('/parents/:id', async (req, res) => {
});

app.listen(port, () => {
    console.log('Running...');
})