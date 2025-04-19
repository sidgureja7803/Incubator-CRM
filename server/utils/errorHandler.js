// Custom error class for operational errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
  // Default values
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error for debugging
  console.error('ERROR 💥', err);

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error.message = `Invalid input data: ${messages.join('. ')}`;
    error.statusCode = 400;
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `Duplicate field value: ${field}. Please use another value.`;
    error.statusCode = 400;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    error.message = `Invalid ${err.path}: ${err.value}`;
    error.statusCode = 400;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token. Please log in again.';
    error.statusCode = 401;
  }
  
  // Handle JWT expired error
  if (err.name === 'TokenExpiredError') {
    error.message = 'Your token has expired. Please log in again.';
    error.statusCode = 401;
  }

  // Send error response
  if (process.env.NODE_ENV === 'production') {
    // For production, only send operational errors with their messages
    // For programming or unknown errors, send generic message
    if (error.isOperational) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message
      });
    }
    
    // For non-operational errors in production
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.'
    });
  } 
  
  // For development, send detailed error
  return res.status(error.statusCode).json({
    status: 'error',
    message: error.message,
    error: err,
    stack: err.stack
  });
};

// Function to catch async errors in route handlers
const catchAsync = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  globalErrorHandler,
  catchAsync
}; 