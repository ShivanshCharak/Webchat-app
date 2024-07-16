import { WebSocket, WebSocketServer } from 'ws';
import Redis from 'ioredis';
import jwt from 'jsonwebtoken';

const pub = new Redis('127.0.0.1:6379');
const sub = new Redis('127.0.0.1:6379');
const clients = new Map();
const wss = new WebSocketServer({ noServer: true });

export async function redisInit(roomNumber, username) {
  await sub.subscribe(roomNumber);
  console.log(`Subscribed to room: ${roomNumber} for user: ${username}`);
}

export function createSocketService(server, secretKey) {
  server.on('upgrade', (req, socket, head) => {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const token = urlParams.get('token');

    if (!token) {
      socket.destroy();
      return;
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        socket.destroy();
        return;
      }

      wss.handleUpgrade(req, socket, head, (ws) => {
        ws.roomNumber = decoded.roomNumber;
        ws.username = decoded.username;
        wss.emit('connection', ws, req);
      });
    });
  });

  wss.on('connection', (ws) => {
    const { roomNumber, username } = ws;
    clients.set(ws, { roomNumber, username });

    ws.on('message', async (msg) => {
      console.log(`Message from ${username} in room ${roomNumber}: ${msg}`);
      await pub.publish(roomNumber, msg);
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log(`WebSocket closed for ${username} in room ${roomNumber}`);
    });
  });

  sub.on('message', (channel, message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.roomNumber === channel) {
        client.send(message);
      }
    });
  });
}
