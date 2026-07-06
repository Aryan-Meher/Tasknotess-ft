// app.js
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
// app.use(cors({ origin: "https://notenest-lilac-alpha.vercel.app",credentials: true}));
app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://notenest-lilac-alpha.vercel.app"
  ],
  credentials: true
}));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// Logger
app.use(morgan('combined', { stream: logger.stream }));
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running '
  });
});

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/notes', require('./routes/noteRoutes'));

app.use(errorHandler);

module.exports = app;
