const repository = require('../repositories/url.repository');
const redis = require('redis');
const config = require('../config');

const redisClient = redis.createClient(config.redis);
redisClient.connect().catch(err => console.error('Lỗi khởi tạo Redis client:', err));

function base62Encode(number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    do {
        result = characters[number % 62] + result;
        number = Math.floor(number / 62);
    } while (number > 0);
    return result.padStart(6, '0');
}

async function findOrigin(id) {
    return await repository.findUrlById(id);
}

async function shortUrl(url) {
    try {
        const timestamp = Date.now();
        let counter = await redisClient.incr('url_counter');
        let retries = 0;
        const maxRetries = 5;

        while (retries < maxRetries) {
            const uniqueNumber = timestamp + counter;
            const newID = base62Encode(uniqueNumber);

            if (!(await repository.exists(newID))) {
                await repository.createUrl(newID, url);
                return newID;
            }

            counter++;
            retries++;
        }

        throw new Error('Không thể tạo ID duy nhất sau nhiều lần thử');
    } catch (err) {
        console.error('Lỗi trong shortUrl:', err);
        throw err;
    }
}

module.exports = { findOrigin, shortUrl };