// bullboard.js
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const basicAuth = require('express-basic-auth');

const bookingQueue = require('../bookingQueue'); // relative to this file

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(bookingQueue),
  ],
  serverAdapter,
});

// --- 🔒 Secure with Basic Auth ---
const username = process.env.ADMIN_USER || 'admin';
const password = process.env.ADMIN_PASS || 'password';

const authMiddleware = basicAuth({
  users: { [username]: password },
  challenge: true,
  realm: 'BullBoard',
});

module.exports = { serverAdapter, authMiddleware };
//REDIS_UR=rediss://default:AX7cAAIncDJiMjQyNzQwZDVkMGI0ZmQ1YjFhNzUzODA0MzNhZjBjZnAyMzI0NzY@humble-burro-32476.upstash.io:6379
