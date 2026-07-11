const { Worker, QueueScheduler } = require('bullmq');
const db = require('./pg');
const { sendEmail } = require('./emailService'); // adjust if named export differs

const bookingQueueName = 'bookingQueue';
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// ensure scheduler uses same connection (retries/delayed jobs)
const scheduler = new QueueScheduler(bookingQueueName, { connection: { url: redisUrl } });

const worker = new Worker(
  bookingQueueName,
  async (job) => {
    switch (job.name) {
      case 'sendConfirmation':
        await handleSendConfirmation(job.data);
        break;
      case 'updateAnalytics':
        await handleUpdateAnalytics(job.data);
        break;
      default:
        console.warn('Unhandled job', job.name);
    }
  },
  { connection: { url: redisUrl }, concurrency: 5 }
);

worker.on('completed', (job) => console.info('Job completed', job.id, job.name));
worker.on('failed', (job, err) => console.error('Job failed', job.id, job.name, err));

async function handleSendConfirmation(data) {
  const { bookingId } = data;
  const client = await db.connect();
  try {
    const res = await client.query(
      'SELECT b.*, u.email FROM bookings b JOIN users u ON b.user_id = u.id WHERE b.id = $1',
      [bookingId]
    );
    if (res.rowCount === 0) throw new Error('Booking not found');
    const booking = res.rows[0];
    await sendEmail({ to: booking.email, subject: 'Your booking confirmation', html: `Booking #${booking.id} confirmed` });
  } finally {
    client.release();
  }
}

async function handleUpdateAnalytics(data) {
  console.log('Analytics job', data);
}

module.exports = { worker, scheduler };
