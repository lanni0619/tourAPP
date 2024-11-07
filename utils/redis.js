const Redis = require('redis');

// redis
const redisClient = Redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
redisClient
  .connect()
  .then(() => console.log(`Redis running on: ${process.env.REDIS_HOST}`))
  .catch((err) => console.log('Connecting Error💥', err));

module.exports = redisClient;
