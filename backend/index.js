require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errorMiddleware } = require('./middlewares');
const { checkConnection } = require('./config').dbConnection;

const port = process.env.APP_PORT || 8080;
const app = express();

app.use(cookieParser());
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Routes
app.use('/', require('./routes'));

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Resource not found' });
});

// Centralized error handler
app.use(errorMiddleware);

process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]:', reason);
});

const { scheduler } = require('./jobs');

if (process.env.NODE_ENV !== 'test') {
  checkConnection()
    .then(() => {
      scheduler.start();
      app.listen(port, () => {
        console.log(`[${process.env.NODE_ENV || 'development'}] AarogyaMed API Server is listening on port ${port}`);
      });
    })
    .catch((err) => {
      console.error('Database connection failed. Starting server in degraded mode for development:', err.message);
      app.listen(port, () => {
        console.log(`[${process.env.NODE_ENV || 'development'}] AarogyaMed API Server is listening on port ${port} (DB disconnected)`);
      });
    });
}

module.exports = app;
