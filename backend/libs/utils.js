const { ZodError } = require('zod');
const {
  NO_CONTENT,
  CONFLICT,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
} = require('./constants');
const {
  BadRequest,
  NotFound,
  Conflict,
  NoContent,
  Unauthorized,
  Forbidden,
} = require('./error');

exports.errorHandler = (error) => {
  if (error instanceof ZodError) return BAD_REQUEST;

  // Sequelize Database Errors
  if (error.name === 'SequelizeUniqueConstraintError') {
    const errorMessages = error.errors
      ? error.errors.map((err) => `${err.path || 'Field'}: ${err.message}`).join(', ')
      : error.message;
    error.message = `Duplicate resource: ${errorMessages}`;
    return CONFLICT;
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    error.message = 'Referenced resource or relational foreign key does not exist';
    return BAD_REQUEST;
  }

  if (error.name === 'SequelizeDatabaseError') {
    if (error.parent && error.parent.code === '22P02') {
      error.message = 'Invalid identifier format (expected valid UUID or numerical ID)';
      return BAD_REQUEST;
    }
    return INTERNAL_SERVER_ERROR;
  }

  if (error.name === 'SequelizeValidationError') {
    const errorMessages = error.errors
      ? error.errors.map((err) => `${err.path || 'Field'}: ${err.message}`).join(', ')
      : error.message;
    error.message = `Validation failed: ${errorMessages}`;
    return BAD_REQUEST;
  }

  // Authentication & Token Errors
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    error.message = 'Authentication token is invalid or has expired';
    return UNAUTHORIZED;
  }

  // Malformed JSON Body
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    error.message = 'Malformed JSON payload in request body';
    return BAD_REQUEST;
  }

  // Domain Exceptions
  if (error instanceof BadRequest) return BAD_REQUEST;
  if (error instanceof NotFound) return NOT_FOUND;
  if (error instanceof Conflict) return CONFLICT;
  if (error instanceof NoContent) return NO_CONTENT;
  if (error instanceof Unauthorized) return UNAUTHORIZED;
  if (error instanceof Forbidden) return FORBIDDEN;

  if (error.statusCode && typeof error.statusCode === 'number') {
    return error.statusCode;
  }
  if (error.status && typeof error.status === 'number') {
    return error.status;
  }

  return INTERNAL_SERVER_ERROR;
};

