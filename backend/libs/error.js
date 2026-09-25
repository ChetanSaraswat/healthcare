class BadRequest extends Error {
  constructor(message = 'Bad Request') {
    super(message);
    this.name = 'BadRequest';
    this.statusCode = 400;
  }
}

class Unauthorized extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'Unauthorized';
    this.statusCode = 401;
  }
}

class Forbidden extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'Forbidden';
    this.statusCode = 403;
  }
}

class NotFound extends Error {
  constructor(message = 'Resource Not Found') {
    super(message);
    this.name = 'NotFound';
    this.statusCode = 404;
  }
}

class Conflict extends Error {
  constructor(message = 'Conflict / Already Exists') {
    super(message);
    this.name = 'Conflict';
    this.statusCode = 409;
  }
}

class NoContent extends Error {
  constructor(message = 'No Content') {
    super(message);
    this.name = 'NoContent';
    this.statusCode = 204;
  }
}

class InternalServerError extends Error {
  constructor(message = 'Internal Server Error') {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;
  }
}

module.exports = {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  NoContent,
  InternalServerError,
};
