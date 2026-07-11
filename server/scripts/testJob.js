const { Queue } = require('bullmq');
require('dotenv').config();

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const bookingQueue = new Queue('bookingQueue', { connection: { url: redisUrl } });

async function run() {
  console.log('Adding test job to bookingQueue...');
  const job = await bookingQueue.add('sendConfirmation', { bookingId: 1 }, { removeOnComplete: true });
  console.log('Added job id:', job.id, ' — now watch worker logs for processing.');
  await bookingQueue.close();
  process.exit(0);
}

run().catch(err => { console.error('Test job error:', err); process.exit(1); });