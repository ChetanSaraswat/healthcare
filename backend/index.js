require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errorMiddleware } = require('./middlewares');
const { checkConnection } = require('./config').dbConnection;
require('./services/admin-notification.service');

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

// Routes (Supports both standard root and /api/v1 versioned prefix)
app.use('/api/v1', require('./routes'));
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
