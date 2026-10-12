require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errorMiddleware } = require('./middlewares');
const { checkConnection } = require('./config').dbConnection;
require('./services/admin-notification.service');

const env = require('./config/env');
const port = env.PORT;
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

const allowedOrigins = env.CLIENT_URL.split(',').map((url) => url.trim());

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

// Cloud Storage: Ensure cloud storage configuration integrity on startup
const { storageService } = require('./services');
if (process.env.NODE_ENV === 'production' && !storageService.isConfigured()) {
  throw new Error(
    '[Startup Error] Missing mandatory Cloudinary configuration in production: ' +
    'CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must be defined on ephemeral deployments.'
  );
}

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

let server = null;

const gracefulShutdown = async (signal) => {
  console.log(`[Graceful Shutdown] Received ${signal}. Closing server connections...`);
  try {
    if (scheduler && typeof scheduler.stop === 'function') {
      scheduler.stop();
    }
  } catch (schedErr) {
    console.warn('[Graceful Shutdown] Error stopping scheduler:', schedErr.message);
  }

  if (server) {
    server.close(async () => {
      console.log('[Graceful Shutdown] HTTP server closed.');
      try {
        const { sequelize } = require('./models');
        if (sequelize && typeof sequelize.close === 'function') {
          await sequelize.close();
          console.log('[Graceful Shutdown] Database pool closed.');
        }
      } catch (dbErr) {
        console.error('[Graceful Shutdown] Error closing database:', dbErr.message);
      }
      process.exit(0);
    });

    setTimeout(() => {
      console.error('[Graceful Shutdown] Force shutdown after 10s timeout.');
      process.exit(1);
    }, 10000).unref();
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

if (process.env.NODE_ENV !== 'test') {
  checkConnection()
    .then(() => {
      scheduler.start();
      server = app.listen(port, () => {
        console.log(`[${env.NODE_ENV}] Omkar Healthcare API Server is listening on port ${port}`);
      });
    })
    .catch((err) => {
      console.error('Database connection failed. Starting server in degraded mode for development:', err.message);
      server = app.listen(port, () => {
        console.log(`[${env.NODE_ENV}] Omkar Healthcare API Server is listening on port ${port} (DB disconnected)`);
      });
    });
}

module.exports = app;
