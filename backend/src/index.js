import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createSocketService, redisInit } from './service/socketService.js';
import { createQueue } from './service/Queue.js';

const app = express();
const secretKey = "your_secret_key";

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json({ limit: '10mb' }));

app.get("/", (req, res) => {
  console.log("Hello world");
  res.send("Hello world");
});

app.post('/chat', async (req, res) => {
  const { roomNumber, username } = req.body;
  console.log('Request body:', req.body);
  if (!roomNumber || !username) {
    return res.status(400).send('roomNumber and username are required');
  }

  const token = jwt.sign({ roomNumber, username }, secretKey, { expiresIn: '1h' });

  await redisInit(roomNumber, username);
  res.json({ token });
});

app.post('/chatRandomly', async (req, res) => {
  console.log(req.body);
  const { username } = req.body;
  console.log(username);
  let roomNumber = await createQueue(username);
  const token = jwt.sign({ roomNumber, username }, secretKey, { expiresIn: '1h' });
  res.json({ roomNumber, token });
});

export const server = app.listen(3000, () => {
  console.log("Listening on port 3000");
});

createSocketService(server, secretKey);
