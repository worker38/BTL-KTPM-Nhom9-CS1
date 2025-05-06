const validUrl = require('valid-url');

module.exports = (req, res, next) => {
    const url = req.query.url || req.body.url;
    if (!url || !validUrl.isUri(url)) {
        return res.status(400).json({ error: 'URL không hợp lệ' });
    }
    next();
};