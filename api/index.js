const express = require('express');
const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const redisPublisher = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

app.use(express.json());

app.post('/api/send-mail', (req, res) => {
    const {title, message} = req.body;

    redisPublisher.publish('send', JSON.stringify(title, message));

    res.json({success: true});
});

const port = 5000 || process.env.PORT;
app.listen(port, () => console.log(`Server up on port ${port}`));