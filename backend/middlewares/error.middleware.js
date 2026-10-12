const { errorHandler } = require('../libs/utils');
const { ZodError } = require('zod');
const env = require('../config/env');

module.exports = (err, req, res, next) => {
  const status = errorHandler(err);
  const message = err.message || 'Internal Server Error';

  let details;
  if (err instanceof ZodError) {
    details = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  } else if (err.errors && Array.isArray(err.errors)) {
    details = err.errors.map((e) => ({
      field: e.path || undefined,
      message: e.message || String(e),
    }));
  }

  if (status >= 500) {
    console.error(`[Server Error 500] ${req.method} ${req.originalUrl}:`, err);
  } else {
    console.warn(`[Client Error ${status}] ${req.method} ${req.originalUrl}: ${message}`);
  }

  const showStack = env.NODE_ENV === 'development' && env.SHOW_STACK_TRACE === 'true';

  res.status(status).json({
    success: false,
    statusCode: status,
    message,
    error: message,
    ...(details ? { details, errors: details } : {}),
    ...(showStack && { stack: err.stack }),
  });
};

