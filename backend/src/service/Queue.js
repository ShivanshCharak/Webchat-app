import Redis from 'ioredis';
import { redisInit } from './socketService.js';

const queue = new Redis('127.0.0.1:6379');
let roomNumber;
let user1;
let user2;

export async function createQueue(username) {
  await queue.lpush('username', username);
  const queueLength = await queue.llen('username');
  if (queueLength === 2) {
    user1 = await queue.rpop('username');
    user2 = await queue.rpop('username');
    const stringPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 15; i++) {
      result += stringPool.charAt(Math.floor(Math.random() * stringPool.length));
    }
    roomNumber = result;
    await redisInit(roomNumber, user1);
    await redisInit(roomNumber, user2);
  }
  return roomNumber;
}
