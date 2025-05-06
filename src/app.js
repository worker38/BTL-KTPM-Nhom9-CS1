const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const urlRoutes = require('./routes/url.route');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(helmet());
app.use(express.static(path.join(__dirname, '../public')));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.'
});
app.use(limiter);

app.use(urlRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.use(errorHandler);

module.exports = app;