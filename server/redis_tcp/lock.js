const { v4: uuidv4 } = require('uuid');
const redisClient = require('../config/redis_TCP');

const RELEASE_LUA = `
if redis.call("GET", KEYS[1]) == ARGV[1] then
  return redis.call("DEL", KEYS[1])
else
  return 0
end
`;

async function acquireLock(key, ttlMs = 10000) {
  const value = uuidv4();
  const res = await redisClient.set(key, value, 'NX', 'PX', ttlMs);
  if (res === 'OK') return { key, value };
  return null;
}

async function releaseLock(key, value) {
  try {
    const res = await redisClient.eval(RELEASE_LUA, 1, key, value);
    return res === 1;
  } catch (err) {
    console.error('Error releasing lock', err);
    return false;
  }
}

module.exports = { acquireLock, releaseLock };