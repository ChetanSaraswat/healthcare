const { errorHandler } = require('../libs/utils');

module.exports = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  const status = errorHandler(err);
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    error: message,
    statusCode: status,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
