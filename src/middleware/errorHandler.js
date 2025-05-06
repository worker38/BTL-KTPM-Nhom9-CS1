module.exports = (err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'SequelizeDatabaseError') {
        return res.status(500).json({ error: 'Lỗi cơ sở dữ liệu, vui lòng thử lại sau' });
    }
    if (err.message.includes('Không thể tạo ID')) {
        return res.status(503).json({ error: 'Dịch vụ tạm thời không khả dụng' });
    }
    if (err.message.includes('Redis')) {
        return res.status(503).json({ error: 'Lỗi dịch vụ cache, đang sử dụng dữ liệu trực tiếp' });
    }
    res.status(500).json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
};