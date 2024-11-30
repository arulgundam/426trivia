import express from 'express';
import bodyParser from 'body-parser';
import { db } from './db.mjs';

const app = express();

const port = 3000;

app.use(bodyParser.json());

app.get('/nodes', async (req, res) => {
});

app.get('/nodes/:id', async (req, res) => {
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