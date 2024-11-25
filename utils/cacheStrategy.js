const redisClient = require('./redisClient');

exports.clearGetTop3busyMonth = async () => {
  const cacheKeyPattern = 'cache:aggregation:getTop3busyMonth:*';
  const keys = await redisClient.keys(cacheKeyPattern);
  for (const key of keys) {
    await redisClient.del(key);
  }
};
