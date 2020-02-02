const express = require('express');
const redis = require('redis');
const dotenv = require('dotenv');
const Queue = require('bull');

dotenv.config();

const mailQueue = new Queue('mail-queue', {redis: {port: process.env.REDIS_PORT, host: process.env.REDIS_HOST}});

const app = express();

app.use(express.json());

app.post('/api/send-mail', (req, res) => {
    const {title, message} = req.body;

    mailQueue.add({title, message}, {attempts: 3, backoff: 5000});

    res.json({success: true});
});

const port = 5000 || process.env.PORT;
app.listen(port, () => console.log(`Server up on port ${port}`));