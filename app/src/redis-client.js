const redis = require('redis');

let redisClient = {};

(async () => {
  redisClient = redis.createClient({ url: 'redis://redis:6379/0' });

  redisClient.on('error', (error) => {
    console.error(`Error to connect Redis: ${error}`);
  });

  redisClient.on('connect', (error) => {
    console.error(`connected to redis`);
  });
  await redisClient.connect();
})();

module.exports = redisClient;
