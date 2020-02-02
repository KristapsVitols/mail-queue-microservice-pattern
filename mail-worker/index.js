const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const Queue = require('bull');

dotenv.config();
const mailQueue = new Queue('mail-queue', {redis: {port: process.env.REDIS_PORT, host: process.env.REDIS_HOST}});

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
    },
});

mailQueue.process(async job => {
    console.log('Starting job...', job.data);
    try {
        await sendMail(job.data);
        console.log('success!');
    } catch (err) {
        console.log('Job failed...');
        return Promise.reject();
    }

    return Promise.resolve('done!!!');
});

mailQueue.on('completed', (job, result) => {
    console.log(job);
    console.log(result);
});

function sendMail(data) {
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from: '"Test" <test@example.com>',
            to: 'test1@example.com',
            subject: data.title,
            text: data.message,
        }, (err, info) => {
            if (err) {
                return reject(`Shit went bad - ${err}`);
            }

            return resolve(`Message sent: ${JSON.stringify(info)}`);
        });
    });
}