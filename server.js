const cluster = require('cluster');
const os = require('os');
const redis = require('redis');
const config = require('./src/config');
const { sequelize } = require('./src/models/data.model');
const app = require('./src/app');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} đang chạy`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} đã dừng`);
        cluster.fork();
    });
} else {
    const redisClient = redis.createClient(config.redis);
    redisClient.connect().then(async () => {
        try {
            await require('./src/repositories/url.repository').warmupCache();
            console.log(`Worker ${process.pid} đã làm nóng cache thành công`);
        } catch (err) {
            console.error(`Worker ${process.pid} lỗi khi làm nóng cache:`, err);
        }
    }).catch(err => {
        console.error(`Worker ${process.pid} lỗi kết nối Redis:`, err);
    });

    app.listen(config.port, () => {
        console.log(`Worker ${process.pid} đang lắng nghe tại cổng ${config.port}`);
    });

    process.on('SIGINT', async () => {
        try {
            await sequelize.close();
            if (redisClient.isOpen) {
                await redisClient.quit();
            }
            console.log(`Worker ${process.pid} đã đóng kết nối Database và Redis`);
            process.exit(0);
        } catch (err) {
            console.error(`Worker ${process.pid} lỗi khi đóng kết nối:`, err);
            process.exit(1);
        }
    });
}