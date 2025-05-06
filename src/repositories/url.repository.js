const { Data } = require('../models/data.model');
const redis = require('redis');
const config = require('../config');
const retry = require('async-retry');

const client = redis.createClient(config.redis);

client.connect().then(() => console.log('Redis đã kết nối')).catch(console.error);

class UrlRepository {
    async findUrlById(id) {
        return await retry(async () => {
            try {
                const cacheKey = `url:${id}`;
                let cachedUrl = await client.get(cacheKey);
                if (cachedUrl) {
                    const accessCount = await client.incr(`access:${id}`);
                    const ttl = accessCount > 10 ? 86400 : 3600; // 24h nếu truy cập > 10 lần
                    await client.expire(cacheKey, ttl);
                    return cachedUrl;
                }
            } catch (err) {
                console.error('Redis không khả dụng, fallback sang DB:', err);
            }

            const record = await Data.findOne({ where: { id } });
            if (record) {
                try {
                    const cacheKey = `url:${id}`;
                    await client.setEx(cacheKey, 3600, record.url);
                } catch (err) {
                    console.error('Lỗi khi lưu cache:', err);
                }
                return record.url;
            }
            return null;
        }, { retries: 3, minTimeout: 1000 });
    }

    async createUrl(id, url) {
        return await retry(async () => {
            await Data.create({ id, url });
            const cacheKey = `url:${id}`;
            await client.setEx(cacheKey, 3600, url);
            return id;
        }, { retries: 3, minTimeout: 1000 });
    }

    async exists(id) {
        return await retry(async () => {
            const cacheKey = `url:${id}`;
            const cached = await client.get(cacheKey);
            if (cached) return true;
            const record = await Data.findOne({ where: { id } });
            return !!record;
        }, { retries: 3, minTimeout: 1000 });
    }

    async warmupCache(limit = 100) {
        try {
            const records = await Data.findAll({
                limit,
                order: [['createdAt', 'DESC']]
            });
            const pipeline = client.multi();
            for (const record of records) {
                const cacheKey = `url:${record.id}`;
                pipeline.setEx(cacheKey, 3600, record.url);
            }
            await pipeline.exec();
            console.log(`Đã làm nóng cache với ${records.length} URL`);
        } catch (err) {
            console.error('Lỗi khi làm nóng cache:', err);
        }
    }
}

const repo = new UrlRepository();
module.exports = repo;