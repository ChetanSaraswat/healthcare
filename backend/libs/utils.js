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
  // Sequelize error handling
  if (error.name === 'SequelizeUniqueConstraintError') {
    const errorMessages = error.errors ? error.errors.map((err) => err.message).join(', ') : error.message;
    error.message = errorMessages;
    return CONFLICT;
  }

  if (error.name === 'SequelizeValidationError') {
    const errorMessages = error.errors ? error.errors.map((err) => err.message).join(', ') : error.message;
    error.message = errorMessages;
    return BAD_REQUEST;
  }

  if (error instanceof BadRequest) return BAD_REQUEST;
  if (error instanceof NotFound) return NOT_FOUND;
  if (error instanceof Conflict) return CONFLICT;
  if (error instanceof NoContent) return NO_CONTENT;
  if (error instanceof Unauthorized) return UNAUTHORIZED;
  if (error instanceof Forbidden) return FORBIDDEN;

  return INTERNAL_SERVER_ERROR;
};
