const redis = require('redis');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
    },
});


const redisSubscriber = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

redisSubscriber.on('message', (channel, dataString) => {
    const data = JSON.parse(dataString);

    console.log('Sending mail...');

    transporter.sendMail({
        from: '"Test" <test@example.com>',
        to: 'test1@example.com',
        subject: data.title,
        text: data.message,
    }, (err, info) => {
        if (err) {
            return console.error(`Shit went bad - ${err}`)
        }

        console.log(`Message sent: ${JSON.stringify(info)}`);
    });
});

redisSubscriber.subscribe('send');