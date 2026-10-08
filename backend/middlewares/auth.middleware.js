const jwt = require('jsonwebtoken');
const { Unauthorized, Forbidden } = require('../libs/error');

exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Unauthorized('Authentication token required');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;
    if (!secret && process.env.NODE_ENV === 'production') {
      throw new Error('Fatal configuration: JWT_SECRET environment variable is missing.');
    }
    const effectiveSecret = secret || 'aarogyamed_secret_key_default';

    const decoded = jwt.verify(token, effectiveSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new Unauthorized('Invalid or expired authentication token'));
    }
    next(error);
  }
};

exports.authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new Unauthorized('User not authenticated'));
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
    return next(new Forbidden('You do not have permission to perform this action'));
  }

  next();
};

exports.optionalAuthenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'aarogyamed_secret_key_default';
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
    }
    next();
  } catch (error) {
    // Graceful continuation for guest checkouts
    next();
  }
};
