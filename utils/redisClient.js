const Redis = require('redis');

const redisClient = Redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient
  .connect()
  .then(() => console.log('Redis connected'))
  .catch((err) => console.error('Redis connection error:', err));

module.exports = redisClient;
