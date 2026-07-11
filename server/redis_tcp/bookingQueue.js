const { Queue } = require('bullmq');

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const bookingQueue = new Queue('bookingQueue', {
  connection: { url: redisUrl },
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

module.exports = bookingQueue;