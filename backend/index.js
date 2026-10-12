require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errorMiddleware } = require('./middlewares');
const { checkConnection } = require('./config').dbConnection;
require('./services/admin-notification.service');

const port = process.env.APP_PORT || 8080;
const app = express();

// Security: Disable X-Powered-By header and apply HTTP security headers
app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: false, // Swagger UI and Next.js frontend assets need CSP flexibility; configure via reverse proxy in production
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

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
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, curl, or server-to-server webhooks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== 'production') {
        // In development/test, permit local origins
        if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
          return callback(null, true);
        }
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// API Documentation (OpenAPI 3.0 / Swagger UI)
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');
const path = require('path');

const openapiYamlPath = path.join(__dirname, 'docs/openapi.yaml');
let openapiSpec;
try {
  const fileContent = fs.readFileSync(openapiYamlPath, 'utf8');
  openapiSpec = YAML.parse(fileContent);
} catch (err) {
  console.warn('[OpenAPI] Failed to parse openapi.yaml:', err.message);
}

if (openapiSpec) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, {
    customSiteTitle: 'Omkar Healthcare API Documentation',
    customCss: '.swagger-ui .topbar { background-color: #16453A; }',
  }));

  app.get(['/api/docs.yaml', '/api/docs/openapi.yaml'], (req, res) => {
    res.setHeader('Content-Type', 'text/yaml');
    res.sendFile(openapiYamlPath);
  });

  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(openapiSpec);
  });
}

// Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// General API rate limiter
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests from this IP address, please try again after 15 minutes',
    error: 'Rate limit exceeded',
  },
  skip: (req) => process.env.NODE_ENV === 'test' || req.path.startsWith('/docs') || req.path === '/health',
});

// Routes (Supports both standard root and /api/v1 versioned prefix)
app.use('/api/v1', apiLimiter, require('./routes'));
app.use('/api', apiLimiter);
app.use('/', require('./routes'));

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
    error: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
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
        console.log(`[${process.env.NODE_ENV || 'development'}] Omkar Healthcare API Server is listening on port ${port}`);
      });
    })
    .catch((err) => {
      console.error('Database connection failed. Starting server in degraded mode for development:', err.message);
      app.listen(port, () => {
        console.log(`[${process.env.NODE_ENV || 'development'}] Omkar Healthcare API Server is listening on port ${port} (DB disconnected)`);
      });
    });
}

module.exports = app;
