
const redis = require('redis')

// connection to redis

const redisClient = redis.createClient(
 17493,
  "redis-17493.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("mvD48Am6qCrzlPbfDSJpTVwXBRzVDqs9", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

module.exports.redisClient = redisClient