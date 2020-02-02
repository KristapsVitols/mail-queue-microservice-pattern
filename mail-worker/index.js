const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const redisSubscriber = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

redisSubscriber.on('message', (channel, dataString) => {
    const data = JSON.parse(dataString);

    console.log(data);
});

redisSubscriber.subscribe('send');