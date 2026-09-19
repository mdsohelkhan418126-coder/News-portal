const ApiError = require('../utils/ApiError');

exports.notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
    message = Object.values(errors)[0];
  } else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'value';
    message = `That ${field} is already in use`;
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please log in again';
  }

  if (statusCode === 500) console.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 && { stack: err.stack }),
  });
};
