const { ZodError } = require('zod');
const { BAD_REQUEST } = require('../libs/constants');

exports.validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (validated.body) req.body = validated.body;
    if (validated.query) req.query = validated.query;
    if (validated.params) req.params = validated.params;

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      const formatted = details
        .map((d) => (d.field ? `${d.field}: ${d.message}` : d.message))
        .join(', ');

      return res.status(BAD_REQUEST).json({
        success: false,
        statusCode: BAD_REQUEST,
        message: `Validation failed: ${formatted}`,
        error: `Validation failed: ${formatted}`,
        details,
        errors: details,
      });
    }
    next(error);
  }
};
