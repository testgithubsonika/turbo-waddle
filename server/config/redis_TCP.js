const { Redis } = require('ioredis');
require('dotenv').config();

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:c';
//connection=url:process.env.UPSTASH_REDIS_URL
const baseOptions = {
  maxRetriesPerRequest: null,
  family: 4,
  keepAlive: true,
  connectTimeout: 60000,
  commandTimeout: 5000,
  lazyConnect: false, // connect immediately so errors show on startup
  retryStrategy(times) {
    const delay = Math.min(times * 1000, 5000);
    console.log(`Redis retry attempt ${times}, delay: ${delay}ms`);
    return delay;
  },
};

function createRedis(url = REDIS_URL) {
  // If the URL uses rediss:// enable TLS
  const tlsNeeded = typeof url === 'string' && url.startsWith('rediss://');

  const opts = Object.assign({}, baseOptions, tlsNeeded ? { tls: { rejectUnauthorized: true } } : {});

  const client = new Redis(url, opts);

  client.on('error', (err) => {
    console.error('Redis connection error:', err && err.message ? err.message : err);
  });

  client.on('connect', () => console.log('Redis connected successfully'));
  client.on('ready', () => console.log('Redis client ready'));
  client.on('close', () => console.warn('Redis connection closed'));
  client.on('reconnecting', () => console.log('Redis reconnecting...'));

  return client;
}

module.exports = createRedis();
