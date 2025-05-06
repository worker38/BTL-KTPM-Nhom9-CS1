const express = require('express');
const urlService = require('../services/url.service');
const urlValidator = require('../middleware/urlValidator');

const router = express.Router();

router.get('/health', async (req, res) => {
    try {
        await Data.findOne({ limit: 1 });
        await client.ping();
        res.status(200).json({ status: 'OK', database: 'connected', redis: 'connected' });
    } catch (err) {
        res.status(503).json({ status: 'ERROR', error: err.message });
    }
});

router.get('/short/:id', async (req, res) => {
    try {
        const url = await urlService.findOrigin(req.params.id);
        if (!url) return res.status(404).send("<h1>404 - Không tìm thấy URL</h1>");
        res.redirect(url);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/create', urlValidator, async (req, res) => {
    try {
        const url = req.query.url || req.body.url;
        if (!url) return res.status(400).json({ error: 'Vui lòng cung cấp URL' });
        const newID = await urlService.shortUrl(url);
        res.status(201).json({ shortId: newID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;