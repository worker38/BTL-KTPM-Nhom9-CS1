module.exports = {
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    },
    database: {
        storage: process.env.DB_STORAGE || './db/app.db'
    },
    port: process.env.PORT || 3000
};